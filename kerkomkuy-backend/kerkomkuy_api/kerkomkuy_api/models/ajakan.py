from sqlalchemy import Column, Integer, ForeignKey, String
from .meta import Base

class Ajakan(Base):
    __tablename__ = 'ajakan'

    id = Column(Integer, primary_key=True)
    dari_user_id = Column(Integer, ForeignKey('users.id'))
    ke_user_id = Column(Integer, ForeignKey('users.id'))
    grup_id = Column(Integer, ForeignKey('grup.id'))
    status = Column(String, default='pending') 