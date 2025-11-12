# 🔧 แก้ไขปัญหา 404: NOT_FOUND

## ❌ ปัญหา

```
404: NOT_FOUND
Failed to load resource: the server responded with a status of 404
```

## 🔍 สาเหตุที่เป็นไปได้

1. **vercel.json configuration ไม่ถูกต้อง**
2. **API routes ไม่ตรงกับ path ที่เรียก**
3. **Entry point ไม่ถูกต้อง**

## ✅ วิธีแก้ไข

### Step 1: ตรวจสอบ vercel.json

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

### Step 2: ตรวจสอบ api/index.ts

ไฟล์ `api/index.ts` ต้อง:
- ✅ Export default app
- ✅ มี routes ที่ถูกต้อง
- ✅ Health check route อยู่ที่ `/api/health`

### Step 3: ตรวจสอบ URL ที่เรียก

**URL ที่ถูกต้อง**:
```
https://your-project.vercel.app/api/health
```

**URL ที่ผิด**:
```
https://your-project.vercel.app/health  ❌
https://your-project.vercel.app/api/    ❌
```

### Step 4: แก้ไข vercel.json (ถ้าจำเป็น)

ถ้ายังไม่ได้ผล ลองเปลี่ยนเป็น:

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
      "src": "/(.*)",
      "dest": "/api/index.ts"
    }
  ]
}
```

## 🔧 วิธีแก้ไขแบบละเอียด

### Option 1: ใช้ vercel.json แบบใหม่ (Vercel v2)

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

### Option 2: ใช้ไฟล์ api/ แบบใหม่ (Vercel v3 - แนะนำ)

สร้างไฟล์ `api/health.ts`:

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  response.json({
    status: 'ok',
    message: 'Transportation Management API is running',
    database: process.env.POSTGRES_URL ? 'Postgres' : 'SQLite'
  });
}
```

และสร้างไฟล์ `api/customers.ts`, `api/vehicles.ts` ฯลฯ แยกกัน

### Option 3: ใช้ Express app แบบเดิม (แนะนำสำหรับโปรเจกต์นี้)

ตรวจสอบว่า `api/index.ts` มี:

```typescript
import express from 'express';
// ... imports

const app = express();
// ... setup

// Health check
app.get('/api/health', async (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Transportation Management API is running',
    database: process.env.POSTGRES_URL ? 'Postgres' : 'SQLite'
  });
});

// Export for Vercel
export default app;
```

## 🎯 วิธีแก้ไขที่แนะนำ

### 1. ตรวจสอบ vercel.json

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

### 2. ตรวจสอบ api/index.ts

ต้องมี:
- ✅ `export default app;`
- ✅ Routes เริ่มต้นด้วย `/api/`
- ✅ Health check ที่ `/api/health`

### 3. ตรวจสอบ URL

**เรียก**: `https://your-project.vercel.app/api/health`

**ไม่ใช่**: `https://your-project.vercel.app/health`

### 4. Redeploy

1. Push code ใหม่ไปยัง GitHub
2. Vercel จะ auto-deploy
3. หรือ Redeploy จาก Vercel Dashboard

## 🧪 ทดสอบ

### 1. ทดสอบ Health Check

```bash
curl https://your-project.vercel.app/api/health
```

หรือเปิดใน browser:
```
https://your-project.vercel.app/api/health
```

### 2. ทดสอบ Routes อื่นๆ

```bash
# Customers
curl https://your-project.vercel.app/api/customers

# Vehicles
curl https://your-project.vercel.app/api/vehicles

# Plans
curl https://your-project.vercel.app/api/plans
```

## ⚠️ ข้อควรระวัง

1. **Path ต้องเริ่มด้วย `/api/`** - เพราะ routes ใน vercel.json ตั้งเป็น `/api/(.*)`
2. **api/index.ts ต้อง export default app**
3. **vercel.json ต้องถูกต้อง**
4. **ต้อง Redeploy หลังแก้ไข**

## 🔄 หลังจากแก้ไข

1. ✅ แก้ไข `vercel.json` (ถ้าจำเป็น)
2. ✅ ตรวจสอบ `api/index.ts`
3. ✅ Push code ใหม่
4. ✅ Redeploy
5. ✅ ทดสอบ URL: `/api/health`

## 🎯 สรุป

**ปัญหา 404** มักเกิดจาก:
1. **vercel.json routes ไม่ถูกต้อง**
2. **URL ที่เรียกไม่ตรงกับ routes**
3. **api/index.ts ไม่ export default**

**วิธีแก้**:
1. ตรวจสอบ `vercel.json`
2. ตรวจสอบ `api/index.ts`
3. เรียก URL ที่ถูกต้อง: `/api/health`
4. Redeploy

