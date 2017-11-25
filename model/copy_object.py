'''
https://groups.google.com/d/msg/sqlalchemy/wb2M_oYkQdY/SsZL8Q1KBAAJ
'''
from sqlalchemy.inspection import inspect
from sqlalchemy.orm import class_mapper
import logging
log = logging.getLogger(__name__)


def copy_sqla_object(obj, omit_fk=True):
    """
    Given an SQLAlchemy object, creates a new object (FOR WHICH THE OBJECT
    MUST SUPPORT CREATION USING __init__() WITH NO PARAMETERS), and copies
    across all attributes, omitting PKs, FKs (by default), and relationship
    attributes.
    """
    cls = type(obj)
    mapper = class_mapper(cls)
    newobj = cls()  # not: cls.__new__(cls)
    pk_keys = set([c.key for c in mapper.primary_key])
    rel_keys = set([c.key for c in mapper.relationships])
    prohibited = pk_keys | rel_keys
    if omit_fk:
        fk_keys = set([c.key for c in mapper.columns if c.foreign_keys])
        prohibited = prohibited | fk_keys
    log.debug("copy_sqla_object: skipping: {}".format(prohibited))
    for k in [p.key for p in mapper.iterate_properties
              if p.key not in prohibited]:
        try:
            value = getattr(obj, k)
            log.debug("copy_sqla_object: processing attribute {} = {}".format(
                k, value))
            setattr(newobj, k, value)
        except AttributeError:
            log.debug("copy_sqla_object: failed attribute {}".format(k))
            pass
    return newobj


def deepcopy_sqla_object(startobj, session, flush=True):
    """
    For this to succeed, the object must take a __init__ call with no
    arguments. (We can't specify the required args/kwargs, since we are copying
    a tree of arbitrary objects.)
    """
    objmap = {}  # keys = old objects, values = new objects
    log.debug("deepcopy_sqla_object: pass 1: create new objects")
    # Pass 1: iterate through all objects. (Can't guarantee to get
    # relationships correct until we've done this, since we don't know whether
    # or where the "root" of the PK tree is.)
    stack = [startobj]
    while stack:
        oldobj = stack.pop(0)
        if oldobj in objmap:  # already seen
            continue
        log.debug("deepcopy_sqla_object: copying {}".format(oldobj))
        newobj = copy_sqla_object(oldobj)
        # Don't insert the new object into the session here; it may trigger
        # an autoflush as the relationships are queried, and the new objects
        # are not ready for insertion yet (as their relationships aren't set).
        # Not also the session.no_autoflush option:
        # "sqlalchemy.exc.OperationalError: (raised as a result of Query-
        # invoked autoflush; consider using a session.no_autoflush block if
        # this flush is occurring prematurely)..."
        objmap[oldobj] = newobj
        insp = inspect(oldobj)
        for relationship in insp.mapper.relationships:
            log.debug("deepcopy_sqla_object: ... relationship: {}".format(
                relationship))
            related = getattr(oldobj, relationship.key)
            if relationship.uselist:
                stack.extend(related)
            elif related is not None:
                stack.append(related)
    # Pass 2: set all relationship properties.
    log.debug("deepcopy_sqla_object: pass 2: set relationships")
    for oldobj, newobj in objmap.items():
        log.debug("deepcopy_sqla_object: newobj: {}".format(newobj))
        insp = inspect(oldobj)
        # insp.mapper.relationships is of type
        # sqlalchemy.utils._collections.ImmutableProperties, which is basically
        # a sort of AttrDict.
        for relationship in insp.mapper.relationships:
            # The relationship is an abstract object (so getting the
            # relationship from the old object and from the new, with e.g.
            # newrel = newinsp.mapper.relationships[oldrel.key],
            # yield the same object. All we need from it is the key name.
            log.debug("deepcopy_sqla_object: ... relationship: {}".format(
                relationship.key))
            related_old = getattr(oldobj, relationship.key)
            if relationship.uselist:
                related_new = [objmap[r] for r in related_old]
            elif related_old is not None:
                related_new = objmap[related_old]
            else:
                related_new = None
            log.debug("deepcopy_sqla_object: ... ... adding: {}".format(
                related_new))
            setattr(newobj, relationship.key, related_new)
    # Now we can do session insert.
    log.debug("deepcopy_sqla_object: pass 3: insert into session")
    for newobj in objmap.values():
        session.add(newobj)
    # Done
    log.debug("deepcopy_sqla_object: done")
    if flush:
        session.flush()
    return objmap[startobj]  # returns the new object matching startobj

