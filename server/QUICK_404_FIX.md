# ⚡ แก้ไข 404 Error อย่างรวดเร็ว

## ❌ ปัญหา

```
404: NOT_FOUND
Failed to load resource: the server responded with a status of 404
```

## ✅ วิธีแก้ไข (3 ขั้นตอน)

### Step 1: แก้ไข vercel.json

เปลี่ยน routes จาก:
```json
{
  "src": "/api/(.*)",
  "dest": "/api/index.ts"
}
```

เป็น:
```json
{
  "src": "/(.*)",
  "dest": "/api/index.ts"
}
```

**เหตุผล**: Vercel จะ route ทุก request ไปที่ Express app และ Express จะจัดการ path `/api/` เอง

### Step 2: Push Code ใหม่

```bash
git add vercel.json
git commit -m "fix: แก้ไข vercel.json routes สำหรับ Express app"
git push origin main
```

### Step 3: Redeploy

1. Vercel จะ auto-deploy เมื่อ push code
2. หรือ Redeploy จาก Vercel Dashboard

## 🧪 ทดสอบ

หลัง deploy เสร็จ:

```
https://your-project.vercel.app/api/health
```

ควรได้:
```json
{
  "status": "ok",
  "message": "Transportation Management API is running",
  "database": "Postgres"
}
```

## 🎯 สรุป

**ปัญหา**: Routes ใน vercel.json ไม่ตรงกับ Express app structure

**วิธีแก้**: เปลี่ยน routes จาก `/api/(.*)` เป็น `/(.*)`

**ทำไม**: Express app จัดการ path `/api/` เองแล้ว ไม่ต้อง match ใน vercel.json

## ✅ หลังแก้ไข

- ✅ `/api/health` → ทำงาน
- ✅ `/api/customers` → ทำงาน
- ✅ `/api/vehicles` → ทำงาน
- ✅ Routes ทั้งหมด → ทำงาน

