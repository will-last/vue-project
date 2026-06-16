<template>
    <div class="container">
        <div class="title">
            <div class="title-text">
                <h2>创建您的账户</h2>
                <p>请填写注册信息</p>
            </div>
        </div>
        <div class="form-container">
            <el-form label-position="top" :model="formData" :rules="rules" ref="submitFormRef">
                <el-form-item label="用户名或邮箱" prop="username">
                    <el-input v-model="formData.username" siez="large" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="formData.email" siez="large" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="formData.nickname" siez="large" placeholder="请输入昵称(可选项)"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="formData.phone" siez="large" placeholder="请输入手机号(可选项)"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="formData.password"  siez="large" type="password" show-password placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input v-model="formData.confirmPassword" siez="large" type="password" show-password placeholder="请再次输入密码"></el-input>
                </el-form-item>
                <div class="btn">
                    <el-button class="btn" siez="large" type="primary" @click="submitForm(submitFormRef)">注册</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { register } from '@/api/front'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const formData = reactive({
    "username": "",
    "email": "",
    "nickname": "",
    "phone": "",
    "password": "",
    "confirmPassword": "",
    "gender": 0,
    "userType": 1
})

const rules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '用户名长度必须在 3 到 20 个字符之间', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度必须在 6 到 20 个字符之间', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请确认密码', trigger: 'blur' },
        {
            validator(rule, value) {
                if (value !== formData.password) {
                    return Promise.reject('两次输入的密码不一致');
                }
                return Promise.resolve();
            },
            trigger: 'blur'
        }
    ]
})

const submitFormRef = ref(null)

const router = useRouter()

const submitForm = (formEl) => {
    if (!formEl) return
    formEl.validate( async (valid) => {
        register(formData).then(({data}) => {
            console.log(data)
            if (!data){
                ElMessage.success('注册成功')
                router.push('/auth/login')
            }
            if (data.code === 'BUSINESS_ERROR') {
                ElMessage.error(data.message)
            }
        })
    })
}

</script>


<style lang="scss" scoped>
.container {
  width: 384px;
  .flex-box {
    display: flex;
    align-items: center;
  }
  .title {
    .title-text {
      text-align: center;
      h2 {
        font-size: 36px;
        margin-bottom: 10px;
      }
      p {
        font-size: 18px;
        color: #6b7280;
      }
    }
  }
  .form-container {
    margin-top: 30px;
    .btn {
      margin-top: 40px;
      width: 100%;
    }
    .footer {
      padding: 30px;
      text-align: center;
    }
  }
}
</style>
