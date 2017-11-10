from sqlalchemy import Column, DateTime, String, Integer, ForeignKey, func, Table
from sqlalchemy.orm import relationship, backref,mapper
from sqlalchemy.ext.declarative import declarative_base


def create_model_table_type(model_class, new_class_name, new_table_name, change_class_attr = {}):
	'''Create a new Class based on a sqla model class with a new class_name and mapped table_name'''
	class_attr_dict = {
		**{
			'__tablename__': new_table_name,
			'__abstract__': True # needed otherwise sqla wants a forgeign key and some __mapper_args__
		}, 
		**change_class_attr
	} # merge dict1 and dict2 one liner { **dict1, **dict2 }
	
	type_class = type(new_class_name, (model_class, ), class_attr_dict)
	
	src_table = model_class.__table__
	new_table = Table(new_table_name, src_table.metadata)
	
	for column in src_table.columns:
		new_table.append_column(column.copy())
			
	mapper(type_class, new_table)
	return type_class


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
                    
                         
Human = create_model_table_type(Employee, 'Human', 'human', {})
Human2 = create_model_table_type(Employee, 'Human2', 'human2', {})


Company = create_model_table_type(Department, 'Company', 'company', {})
Human3 = create_model_table_type(Human2, 'Human3', 'human3', {
    'department_id' : Column(Integer, ForeignKey('company.id')),
    'department' : relationship(
        Department,
        backref=backref('company',
                         uselist=True,
                         cascade='delete,all'))
    
})


def main():
    from sqlalchemy import create_engine
    engine = create_engine('sqlite:///orm_in_detail.sqlite')
     
    from sqlalchemy.orm import sessionmaker
    session = sessionmaker()
    session.configure(bind=engine)
    Base.metadata.create_all(engine)


if __name__ == '__main__':
    main()