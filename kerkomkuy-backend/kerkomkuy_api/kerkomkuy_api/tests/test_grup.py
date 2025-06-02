def test_create_grup(app):
    u1 = app.post_json('/api/users', {"nim": "811", "nama_lengkap": "Admin", "password": "a"}).json
    u2 = app.post_json('/api/users', {"nim": "812", "nama_lengkap": "Anggota", "password": "a"}).json

    res = app.post_json('/api/grup', {
        "admin_id": u1["user_id"],
        "anggota_nim": ["812"],
        "jadwal": ["Senin 10:00–12:00"]
    })
    assert res.json["status"] == "success"
    grup_id = res.json["grup_id"]

    detail = app.get(f'/api/grup/{grup_id}')
    assert detail.json["id"] == grup_id


def test_create_grup_no_anggota(app):
    admin = app.post_json('/api/users', {"nim": "500", "nama_lengkap": "Admin", "password": "x"}).json
    res = app.post_json('/api/grup', {
        "admin_id": admin["user_id"],
        "anggota_nim": [],  # Kosong
        "jadwal": []
    }, expect_errors=True)
    assert res.status_code == 400

def test_grup_not_found(app):
    res = app.get('/api/grup/99999', expect_errors=True)
    assert res.status_code == 404

def test_grup_admin_only_view(app):
    u1 = app.post_json('/api/users', {"nim": "411", "nama_lengkap": "AdminA", "password": "pass"}).json
    u2 = app.post_json('/api/users', {"nim": "412", "nama_lengkap": "AnggotaA", "password": "pass"}).json

    g = app.post_json('/api/grup', {
        "admin_id": u1["user_id"],
        "anggota_nim": ["412"],
        "jadwal": ["Senin 10:00–12:00"]
    }).json

    res = app.get(f'/api/grup?nim=411')
    assert isinstance(res.json, list)
