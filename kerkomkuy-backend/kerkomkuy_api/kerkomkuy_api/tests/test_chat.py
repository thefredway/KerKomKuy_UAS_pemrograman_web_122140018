def test_send_and_get_chat(app):
    u = app.post_json('/api/users', {"nim": "723", "nama_lengkap": "ChatAdmin", "password": "xx"}).json
    anggota = app.post_json('/api/users', {"nim": "724", "nama_lengkap": "Anggota", "password": "yy"}).json

    g = app.post_json('/api/grup', {
        "admin_id": u["user_id"],
        "anggota_nim": ["724"],
        "jadwal": ["Senin 08:00–10:00"]
    }).json

    gid = g["grup_id"]

    app.post_json(f'/api/chat?grup_id={gid}', {
        "sender_nim": "723",
        "teks": "Halo dunia!"
    })

    res = app.get(f'/api/chat?grup_id={gid}')
    assert len(res.json) >= 1

def test_send_chat_invalid_grup(app):
    app.post_json('/api/users', {"nim": "999", "nama_lengkap": "A", "password": "x"})
    res = app.post_json('/api/chat?grup_id=9999', {
        "sender_nim": "999",
        "teks": "tes"
    }, expect_errors=True)
    assert res.status_code == 404

def test_send_chat_missing_fields(app):
    u = app.post_json('/api/users', {"nim": "601", "nama_lengkap": "ChatUser", "password": "abc"}).json
    g = app.post_json('/api/grup', {
        "admin_id": u["user_id"],
        "anggota_nim": [],
        "jadwal": ["Senin 10:00–12:00"]
    }).json

    # Missing teks
    res = app.post_json(f'/api/chat?grup_id={g["grup_id"]}', {
        "sender_nim": "601"
    }, expect_errors=True)
    assert res.status_code == 400

def test_get_chat_invalid_grup(app):
    res = app.get('/api/chat?grup_id=9999', expect_errors=True)
    assert res.status_code == 404
