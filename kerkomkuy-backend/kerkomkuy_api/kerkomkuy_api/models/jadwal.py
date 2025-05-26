from sqlalchemy import Column, Integer, String, ForeignKey
from .meta import Base

class JadwalKuliah(Base):
    __tablename__ = 'jadwal_kuliah'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    hari = Column(String, nullable=False)
    jam_mulai = Column(String, nullable=False)
    jam_selesai = Column(String, nullable=False)
    matkul = Column(String, nullable=False)
