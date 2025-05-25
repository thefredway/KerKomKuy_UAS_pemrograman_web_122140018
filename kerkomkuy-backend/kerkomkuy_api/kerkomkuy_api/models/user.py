from sqlalchemy import Column, Integer, String
from .meta import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    nim = Column(String, unique=True, nullable=False)
    nama_lengkap = Column(String, nullable=False)
    password = Column(String, nullable=False)
