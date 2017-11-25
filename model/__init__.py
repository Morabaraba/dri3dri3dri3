from sqlalchemy import Column, DateTime, String, Integer, ForeignKey, func, Table
from sqlalchemy.orm import relationship, backref,mapper
from sqlalchemy.ext.declarative import declarative_base

def create_model_type(parent_class, child_class_name, child_table_name, extra_child_class_attr = {}, extra_parent_class_attr = {}):
	'''Create a dynamic class based on a parent sqlalchemy declartive model class 
	with a new class name and mapped table name.
	
	The function create a dynamic object class with a `__abstract__ = True` attribute. 
	That gets inherited with parent_class by our new child class.
	
	We add the `__abstract__` causes declarative to skip the production of a 
	table or mapper for the class entirely.
	
	http://docs.sqlalchemy.org/en/latest/orm/extensions/declarative/api.html#abstract
	
	Args:
		parent_class (object): Parent declartive class we want to inherit from.
		child_class_name (str): New class name.
		child_table_name (str): Table name for model.
		extra_child_class_attr (dict):  Extra child attributes you want to add after parent_class.
		extra_parent_class_attr (dict): Extra parent attributes you want to add before parent_class.
		
	Returns:
		The new mapeed sqlalchemy declarative class.
	'''
	parent_table = parent_class.__table__
	child_table = Table(child_table_name, parent_table.metadata)
	for column in parent_table.columns:
		child_table.append_column(column.copy())
	# TODO copy constraints, etc
	extra_parent_class_attr = {
		**{
			'__abstract__': True
			},
		**extra_parent_class_attr
	} # merge dict1 and dict2 one liner { **dict1, **dict2 }
	parent_type_class = type('%sAbstract' % (parent_class.__name__), (object, ), extra_parent_class_attr)
	extra_child_class_attr = {
		**{
			'__tablename__': child_table_name,
		}, 
		**extra_child_class_attr
	} # merge dict1 and dict2 one liner { **dict1, **dict2 }
	child_type_class = type(child_class_name, (parent_type_class, parent_class), extra_child_class_attr)
	mapper(child_type_class, child_table)
	return child_type_class


Base = declarative_base()


class Department(Base):
	__tablename__ = 'department'
	id = Column(Integer, primary_key=True)
	name = Column(String)


class Employee(Base):
	__tablename__ = 'employee'
	id = Column(Integer, primary_key=True)
	name = Column(String)
	# Use default=func.now() to set the default hiring time
	# of an Employee to be the current time when an
	# Employee record was created
	hired_on = Column(DateTime, default=func.now())
	department_id = Column(Integer, ForeignKey('department.id'))
	# Use cascade='delete,all' to propagate the deletion of a Department onto its Employees
	department = relationship(
		Department,
		backref=backref('employees',
						 uselist=True,
						 cascade='delete,all'))

	 
Manager = create_model_type(Employee, 'Manager', 'manager', {
	'department_id' : Column(Integer, ForeignKey('department.id'))
})


Company = create_model_type(Department, 'Company', 'company', {})

'''
Human3 = create_model_type(Human2, 'Human3', 'human3', {
	'department_id' : Column(Integer, ForeignKey('company.id')),
	'department' : relationship(
		Department,
		backref=backref('company',
						 uselist=True,
						 cascade='delete,all'))
})
'''



def main():
	from sqlalchemy import create_engine
	engine = create_engine('sqlite:///orm_in_detail.sqlite')
	 
	from sqlalchemy.orm import sessionmaker
	session = sessionmaker()
	session.configure(bind=engine)
	Base.metadata.create_all(engine)


if __name__ == '__main__':
	main()