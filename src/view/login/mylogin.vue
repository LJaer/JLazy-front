<template>
  <div style="width:100%;height:100%">
    <Row>
      <Col span="8"></Col>
      <Col span=4 style="margin-left:60%;margin-top:20%;" >
        <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
          <FormItem prop="username">
            <Input v-model="form.username" placeholder="请输入用户名">
              <span slot="prepend">
                <Icon :size="16" type="ios-person"></Icon>
              </span>
            </Input>
          </FormItem>
          <FormItem prop="password">
            <Input type="password" v-model="form.password" placeholder="请输入密码">
              <span slot="prepend">
                <Icon :size="14" type="md-lock"></Icon>
              </span>
            </Input>
          </FormItem>
          <FormItem>
            <Button @click="handleSubmit" type="primary" long>登录</Button>
          </FormItem>
        </Form>
      </Col>
    </Row>
  </div>
</template>

<script>
import { login } from "@/api/login";
export default {
  props: {
    usernameRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: "账号不能为空", trigger: "blur" }];
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: "密码不能为空", trigger: "blur" }];
      }
    }
  },
  data() {
    return {
      form: {
        username: "",
        password: ""
      }
    };
  },
  computed: {
    rules() {
      return {
        username: this.usernameRules,
        password: this.passwordRules
      };
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          login(this.form).then(res => {
            if (res.data.status === 200) {
              this.$Message.success("登陆成功");
              //保存access_token
              sessionStorage.setItem(
                "access_token",
                res.data.data.access_token
              );
              this.$router.push("/home");
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>