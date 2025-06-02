def test_create_and_accept_ajakan(app):
    u1 = app.post_json('/api/users', {"nim": "611", "nama_lengkap": "Pengirim", "password": "x"}).json
    u2 = app.post_json('/api/users', {"nim": "612", "nama_lengkap": "Penerima", "password": "x"}).json

    g = app.post_json('/api/grup', {
        "admin_id": u1["user_id"],
        "anggota_nim": ["612"],
        "jadwal": ["Rabu 13:00–15:00"]
    }).json

    res = app.post_json('/api/ajakan', {
        "dari_user_id": u1["user_id"],
        "ke_user_id": u2["user_id"],
        "grup_id": g["grup_id"]
    })
    assert res.json["status"] == "sent"

    ajakan_id = res.json["ajakan_id"]
    update = app.put_json(f'/api/ajakan/{ajakan_id}', {"status": "accepted"})
    assert update.json["status"] == "updated"

def test_ajakan_get_list(app):
    u1 = app.post_json('/api/users', {"nim": "711", "nama_lengkap": "UserA", "password": "x"}).json
    u2 = app.post_json('/api/users', {"nim": "712", "nama_lengkap": "UserB", "password": "x"}).json

    g = app.post_json('/api/grup', {
        "admin_id": u1["user_id"],
        "anggota_nim": ["712"],
        "jadwal": ["Rabu 13:00–15:00"]
    }).json

    app.post_json('/api/ajakan', {
        "dari_user_id": u1["user_id"],
        "ke_user_id": u2["user_id"],
        "grup_id": g["grup_id"]
    })

    res = app.get(f'/api/ajakan?ke_user_id={u2["user_id"]}')
    assert isinstance(res.json, list)

def test_ajakan_update_invalid(app):
    res = app.put_json('/api/ajakan/99999', {"status": "accepted"}, expect_errors=True)
    assert res.status_code == 404
