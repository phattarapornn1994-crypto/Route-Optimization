# 🚀 การตั้งค่า Vercel สำหรับ Express.js

## ✅ Framework: Express - ถูกต้องแล้ว!

Vercel ตรวจพบว่าเป็น **Express.js** project และตั้งค่าให้อัตโนมัติ - **ถูกต้องแล้ว!** ✅

## 📋 การตั้งค่าใน Vercel

### Framework Preset

**เลือก**: 
- ✅ **Express** (Vercel ตรวจพบอัตโนมัติ)
- หรือ **Other** (ถ้าต้องการตั้งค่าเอง)

**ทั้งสองแบบใช้ได้!** Express จะตั้งค่าให้อัตโนมัติ

### การตั้งค่าที่แนะนำ

เมื่อ Vercel ตรวจพบ Express:

1. **Framework Preset**: `Express` ✅
2. **Root Directory**: `.` (หรือ `server` ถ้ามี folder)
3. **Build Command**: `npm run build` ✅
4. **Output Directory**: (เว้นว่าง - เป็น serverless) ✅
5. **Install Command**: `npm install` ✅

## 🔧 ตรวจสอบ vercel.json

ไฟล์ `vercel.json` ควรเป็นแบบนี้:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.ts"
    }
  ]
}
```

## ✅ Checklist สำหรับ Express Project

- [x] Framework: Express (Vercel ตรวจพบอัตโนมัติ)
- [ ] Root Directory: `.` (หรือ `server`)
- [ ] Build Command: `npm run build`
- [ ] Output Directory: (เว้นว่าง)
- [ ] Install Command: `npm install`
- [ ] Environment Variables: `POSTGRES_URL` (จะสร้างอัตโนมัติเมื่อสร้าง Postgres)

## 🚀 ขั้นตอน Deploy

### 1. ตั้งค่า Project

1. **Framework**: Express ✅ (Vercel ตั้งให้แล้ว)
2. **Root Directory**: `.` (ถ้าไฟล์อยู่ที่ root)
3. **Build Command**: `npm run build`
4. **Output Directory**: (เว้นว่าง)
5. **Install Command**: `npm install`

### 2. Environment Variables

**ไม่ต้องตั้งค่าตอนนี้** - จะสร้างอัตโนมัติเมื่อสร้าง Postgres Database

### 3. Deploy

คลิก **"Deploy"** → Vercel จะ:
- ✅ Install dependencies
- ✅ Build project
- ✅ Deploy Express API
- ✅ ให้ URL พร้อมใช้งาน

## 🎯 หลัง Deploy

### ทดสอบ API

```bash
https://your-project.vercel.app/api/health
```

**Expected Response**:
```json
{
  "status": "ok",
  "message": "Transportation Management API is running",
  "database": "Postgres"
}
```

## ⚠️ หมายเหตุ

1. **Express Framework Preset**: Vercel จะตั้งค่าให้อัตโนมัติ - ใช้ได้เลย!
2. **Root Directory**: ต้องชี้ไปที่ folder ที่มี `package.json`
3. **API Routes**: ต้องอยู่ใน `api/index.ts` สำหรับ Vercel serverless

## 🔄 ถ้า Deploy ไม่สำเร็จ

### ปัญหา: Build failed

**ตรวจสอบ**:
1. Root Directory ถูกต้องหรือไม่
2. `package.json` อยู่ใน Root Directory
3. `api/index.ts` มีอยู่

### ปัญหา: Routes ไม่ทำงาน

**ตรวจสอบ**:
1. `vercel.json` ถูกต้อง
2. Routes ใน `api/index.ts` ถูกต้อง
3. Export default app

## 🎉 สรุป

**Framework: Express** - **ถูกต้องแล้ว!** ✅

Vercel ตรวจพบและตั้งค่าให้อัตโนมัติ:
- ✅ Express.js framework
- ✅ Serverless functions
- ✅ API routes

**แค่คลิก "Deploy"** → พร้อมใช้งาน! 🚀

