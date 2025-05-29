from sqlalchemy import Column, Integer, ForeignKey, Table
from sqlalchemy.orm import relationship
from .meta import Base

# Pivot table many-to-many
grup_anggota = Table(
    'grup_anggota',
    Base.metadata,
    Column('grup_id', ForeignKey('grup.id'), primary_key=True),
    Column('user_id', ForeignKey('users.id'), primary_key=True)
)

class Grup(Base):
    __tablename__ = 'grup'

    id = Column(Integer, primary_key=True)
    admin_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    # Relasi many-to-many dengan User
    anggota = relationship("User", secondary=grup_anggota, backref="grup_anggota")

    # Relasi satu-ke-banyak ke ChatMessage
    chat = relationship("ChatMessage", back_populates="grup", cascade="all, delete-orphan")
