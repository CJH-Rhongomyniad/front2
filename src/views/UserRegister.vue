<template>
    <div class="register">
      <h2>用户注册</h2>
      <el-form :model="form" :rules="rules" ref="registerForm" label-width="100px">
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <!-- 手机号 -->
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <!-- 确认密码 -->
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input type="password" v-model="form.confirmPassword" placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <!-- 注册按钮 -->
        <el-form-item>
          <el-button type="primary" @click="submitForm">注册</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>
  
<script>
import JSEncrypt from 'jsencrypt';

  export default {
    name: 'UserRegister',
    data() {
      return {
        form: {
          username: '',
          email: '',
          mobile: '',
          password: '',
          confirmPassword: ''
        },
        rules: {
            username: [
                { required: true, message: '请输入用户名', trigger: 'blur' },
                { min: 4, max: 20, message: '用户名长度在 4 到 20 个字符', trigger: 'blur' }
            ],
            email: [
                { required: true, message: '请输入邮箱', trigger: 'blur' },
                { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
            ],
            mobile: [
                { required: true, message: '请输入手机号', trigger: 'blur' },
                { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
            ],
            password: [
                { required: true, message: '请输入密码', trigger: 'blur' },
                { min: 8, max: 20, message: '密码长度在 8 到 20 个字符', trigger: 'blur' },
                { validator: this.validatePasswordStrength, trigger: 'blur' }
            ],
            confirmPassword: [
                { required: true, message: '请再次输入密码', trigger: 'blur' },
                { validator: this.validateConfirmPassword, trigger: 'blur' }
            ]
        }
      };
    },
    methods: {
        // 验证密码强度
        validatePasswordStrength(rule, value, callback) {
            const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;
            if (!strongRegex.test(value)) {
              callback(new Error('密码需包含大小写字母、数字和特殊字符'));
            } else {
              callback();
            }
        },
        // 验证确认密码
        validateConfirmPassword(rule, value, callback) {
            if (value !== this.form.password) {
              callback(new Error('两次密码输入不一致'));
            } else {
              callback();
            }
        },
        // 提交表单
        submitForm() {
            this.$refs.registerForm.validate((valid) => {
              if (valid) {
                this.register();
              } else {
                console.log('表单验证失败');
                return false;
              }
            });
        },
        // 注册方法
        register() {
            const encrypt = new JSEncrypt();
            // 后端提供的公钥，需要在组件中获取或在请求时动态获取
            encrypt.setPublicKey(this.publicKey);
            // const encryptedPassword = encrypt.encrypt(this.form.password);
            // 准备提交的数据
            const submitData = {
            username: this.form.username,
            email: this.form.email,
            mobile: this.form.mobile,
            password: this.form.password
            };
            // 发送请求
            this.$axios.post('/api/register', submitData)
            .then(response => {
                // 处理成功响应
                console.log(response);
                this.$router.push('/login');
            })
            .catch(error => {
                // 处理错误响应
                console.log(submitData);
                console.log(error);
            });
        },
        // 重置表单
        resetForm() {
            this.$refs.registerForm.resetFields();
        }
    }
  };
</script>
  
<style scoped>
/* 添加样式 */
.register-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.register-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.register-form {
  display: flex;
  flex-direction: column;
}

.register-form-item {
  margin-bottom: 20px;
}

.register-form-item label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #666;
}

.register-form-item input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.register-form-item input:focus {
  border-color: #409eff;
}

.register-form-item .el-form-item__error {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 5px;
}

.register-buttons {
  display: flex;
  justify-content: space-between;
}

.register-buttons button {
  width: 48%;
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.register-buttons .submit-button {
  background-color: #409eff;
  color: #fff;
}

.register-buttons .reset-button {
  background-color: #f56c6c;
  color: #fff;
}
</style>