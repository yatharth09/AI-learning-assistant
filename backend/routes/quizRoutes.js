import express from "express"
import protect from "../middleware/auth"


const router = express.Router()

router.use(protect)

router.get('')

export default router