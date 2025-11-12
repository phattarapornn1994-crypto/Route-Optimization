# 🔧 แก้ไขปัญหา 404 - Final Solution

## ❌ ปัญหา

```
404: NOT_FOUND
Failed to load resource: the server responded with a status of 404
```

## ✅ วิธีแก้ไข (Final)

### Step 1: แก้ไข api/index.ts

เปลี่ยนจาก `export default app` เป็น handler function:

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';

// ... Express app setup ...

// Vercel serverless function handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  await initDb();
  return app(req, res);
}
```

### Step 2: เพิ่ม @vercel/node ใน devDependencies

```json
{
  "devDependencies": {
    "@vercel/node": "^3.0.0"
  }
}
```

### Step 3: vercel.json

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

### Step 4: Push และ Redeploy

```bash
git add .
git commit -m "fix: เปลี่ยนเป็นใช้ Vercel handler function"
git push origin main
```

## 🔍 ตรวจสอบ

### 1. ตรวจสอบ api/index.ts

ต้องมี:
- ✅ `import type { VercelRequest, VercelResponse } from '@vercel/node';`
- ✅ `export default async function handler(req, res)`
- ✅ `return app(req, res);`

### 2. ตรวจสอบ package.json

ต้องมี:
- ✅ `"@vercel/node": "^3.0.0"` ใน devDependencies

### 3. ตรวจสอบ vercel.json

ต้องมี:
- ✅ `rewrites` ที่ชี้ไปที่ `/api/index.ts`

## 🧪 ทดสอบ

หลัง deploy:

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

## ⚠️ ถ้ายังไม่ได้ผล

### ตรวจสอบ Logs

1. **Vercel Dashboard** > **Deployments**
2. คลิก deployment ล่าสุด
3. ดู **Functions** tab
4. ตรวจสอบ error messages

### ตรวจสอบ Build

1. ดู **Build Logs**
2. ตรวจสอบว่ามี error หรือไม่
3. ตรวจสอบว่า dependencies ถูก install หรือไม่

## 🎯 สรุป

**ปัญหา**: Express app ไม่ทำงานบน Vercel serverless

**วิธีแก้**:
1. ✅ เปลี่ยนเป็นใช้ handler function
2. ✅ เพิ่ม @vercel/node types
3. ✅ ใช้ rewrites ใน vercel.json
4. ✅ Push และ Redeploy

**สำคัญ**: ต้องใช้ `export default async function handler()` แทน `export default app`

