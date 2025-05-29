from sqlalchemy import Column, Integer, ForeignKey, String, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .meta import Base

class ChatMessage(Base):
    __tablename__ = 'chat_messages'

    id = Column(Integer, primary_key=True)
    grup_id = Column(Integer, ForeignKey('grup.id'))
    sender_nim = Column(String, nullable=False)  # Bisa diganti ke ForeignKey jika perlu
    teks = Column(Text, nullable=False)
    waktu = Column(DateTime, default=datetime.utcnow)

    # Relasi ke Grup
    grup = relationship("Grup", back_populates="chat")
