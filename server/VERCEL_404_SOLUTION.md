# 🔧 แก้ไขปัญหา 404 Error - Solution

## ❌ ปัญหา

```
GET https://your-project.vercel.app/api/health 404 (Not Found)
```

## ✅ วิธีแก้ไข

### Solution 1: ใช้ rewrites แทน routes (แนะนำ)

เปลี่ยน `vercel.json` เป็น:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/api/index.ts"
    }
  ]
}
```

**เหตุผล**: 
- `rewrites` ทำงานดีกว่า `routes` สำหรับ Express app
- Vercel จะ rewrite ทุก request ไปที่ Express app
- Express จะจัดการ routing เอง

### Solution 2: ตรวจสอบว่า code ถูก push แล้ว

```bash
# ตรวจสอบว่า vercel.json ถูก push แล้ว
git status
git add vercel.json
git commit -m "fix: เปลี่ยนเป็นใช้ rewrites สำหรับ Express app"
git push origin main
```

### Solution 3: Redeploy ใน Vercel

1. **Vercel Dashboard** > **Deployments**
2. คลิก **"Redeploy"** บน deployment ล่าสุด
3. หรือรอให้ Vercel auto-deploy (เมื่อ push code)

## 🔍 ตรวจสอบ

### 1. ตรวจสอบ vercel.json

ไฟล์ `vercel.json` ควรเป็น:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/api/index.ts"
    }
  ]
}
```

### 2. ตรวจสอบ api/index.ts

ต้องมี:
- ✅ `export default app;`
- ✅ Routes เริ่มต้นด้วย `/api/`
- ✅ Health check ที่ `/api/health`

### 3. ตรวจสอบ URL

**เรียก**: 
```
https://your-project.vercel.app/api/health
```

**ไม่ใช่**:
```
https://your-project.vercel.app/health  ❌
https://your-project.vercel.app/        ❌
```

## 🧪 ทดสอบหลังแก้ไข

### 1. Health Check

```bash
curl https://your-project.vercel.app/api/health
```

**Expected**:
```json
{
  "status": "ok",
  "message": "Transportation Management API is running",
  "database": "Postgres"
}
```

### 2. Routes อื่นๆ

```bash
# Customers
curl https://your-project.vercel.app/api/customers

# Vehicles
curl https://your-project.vercel.app/api/vehicles
```

## ⚠️ ถ้ายังไม่ได้ผล

### Option A: ใช้รูปแบบใหม่ (Vercel v3)

ลบ `vercel.json` และใช้โครงสร้างไฟล์:

```
api/
├── index.ts  (Express app)
└── [route].ts  (ถ้าต้องการแยก routes)
```

### Option B: ตรวจสอบ Logs

1. **Vercel Dashboard** > **Deployments**
2. คลิก deployment ล่าสุด
3. ดู **Functions** หรือ **Logs**
4. ตรวจสอบ error messages

### Option C: ตรวจสอบ Build

1. **Vercel Dashboard** > **Deployments**
2. ดู **Build Logs**
3. ตรวจสอบว่ามี error หรือไม่

## 🎯 สรุป

**ปัญหา**: 404 error เมื่อเรียก API

**วิธีแก้**:
1. ✅ เปลี่ยน `vercel.json` เป็นใช้ `rewrites`
2. ✅ Push code ใหม่
3. ✅ Redeploy
4. ✅ ทดสอบ `/api/health`

**vercel.json ที่ถูกต้อง**:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/api/index.ts"
    }
  ]
}
```

## 📋 Checklist

- [ ] แก้ไข `vercel.json` เป็นใช้ `rewrites`
- [ ] Push code ไปยัง GitHub
- [ ] Redeploy ใน Vercel
- [ ] ทดสอบ `/api/health`
- [ ] ตรวจสอบ Logs ถ้ายังไม่ได้ผล

