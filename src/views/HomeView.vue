<template>
  <v-container id="loginForm" fluid class="bg-black d-flex align-center justify-center">
    <v-row class="justify-center">
      <v-col class="" cols="12" sm="6" md="5" lg="4">
        <v-sheet class="mx-auto rounded py-10">
          <v-row class="justify-center">
            <h1 v-if="viewContainer === 1">Log In</h1>
            <h1 v-if="viewContainer === 2">Register</h1>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-alert closable text="" type="error" v-if="errorMessages.length">
                <p v-for="error in errorMessages" :key="error">{{ error }}</p>
              </v-alert>
              <v-alert closable text="" type="success" v-if="successMessages.length">
                <p v-for="message in successMessages" :key="message">{{ message }}</p>
              </v-alert>
            </v-col>
          </v-row>
          <v-row v-if="viewContainer === 1" class="justify-center">
            <v-col cols="10">
              <v-form fast-fail @submit.prevent class="">
                <v-text-field v-model="loginForm.username" label="Username or email address"></v-text-field>

                <v-text-field type="password" v-model="loginForm.password" label="Password"></v-text-field>
              </v-form>
            </v-col>
          </v-row>
          <v-row v-if="viewContainer === 2" class="justify-center">
            <v-col cols="10">
              <v-form fast-fail @submit.prevent class="">
                <v-text-field v-model="registerForm.username" label="Username" required></v-text-field>

                <v-text-field v-model="registerForm.email" label="Email address" required></v-text-field>

                <v-text-field v-model="registerForm.phoneNumber" label="Phone number"></v-text-field>

                <v-text-field type="password" v-model="registerForm.password" label="Password" required></v-text-field>

                <v-text-field type="password" v-model="confirmPassword" label="Confirm password" required></v-text-field>
              </v-form>
            </v-col>
          </v-row>

          <v-row class="justify-center">

            <v-col cols="10" v-if="viewContainer === 1">
              <v-btn type="submit" block @click="submitLoginForm">Log In</v-btn>
            </v-col>
            <v-col cols="10" class="text-center" v-if="viewContainer === 1">
              <p><small>Don't you have an account?</small></p>
              <v-btn type="submit" @click="viewContainer = 2" block class="mt-2">Register</v-btn>
            </v-col>

            <v-col cols="10" v-if="viewContainer === 2">
              <v-btn type="submit" block @click="submitRegisterForm">Register</v-btn>
            </v-col>
            <v-col cols="10" class="text-center" v-if="viewContainer === 2">
              <p><small>Do you already have an account?</small></p>
              <v-btn type="submit" @click="viewContainer = 1; errorMessages = []" block class="mt-2">Login</v-btn>
            </v-col>
          </v-row>

        </v-sheet>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import axios from 'axios'

export default ({
  name: 'HomeView',
  data() {
    return {
      confirmPassword: '',
      viewContainer: 1,
      loginForm: {
        username: '',
        password: ''
      },
      registerForm: {
        username: '',
        email: '',
        phoneNumber: '',
        password: ''
      },
      errorMessages: [],
      successMessages: []
    }
  },
  mounted() {
    document.title = 'Welcome | To Do'
  },
  methods: {
    passwordsMatch() {
      if (this.registerForm.password !== this.confirmPassword) {
        return false
      }
      return true;
    },
    async submitLoginForm() {
      axios.defaults.headers.common["Authorization"] = ""

      localStorage.removeItem("token")

      await axios.post('http://localhost:3000/api/auth/login', this.loginForm)
        .then((response) => {
          const token = response.data.accessToken
          const user = response.data.user

          
          //this.$store.commit('setToken', token)
          
          localStorage.setItem("token", token)
          localStorage.setItem("user", JSON.stringify(user))

          //this.$store.commit('initializeStore');
          //console.log(this.$store.state.isAuthenticated);

          this.$router.push('dashboard')
        })
        .catch(error => {
          console.error(`error: ${error}`)
        })
    },
    async submitRegisterForm() {
      this.errorMessages = []

      if (!this.passwordsMatch()) {
        this.errorMessages.push('Passwords do not match')
      } else {
        await axios.post('http://localhost:3000/api/users', this.registerForm)
          .then((response) => {
            console.log(response)
            this.viewContainer = 1;
            this.successMessages.push('User registered successfully. Now you can Log In');
          })
          .catch(error => {
            console.log(error)
            if (error.response) {
              if (Array.isArray(error.response.data.message)) {
                for (const property in error.response.data.message) {
                  this.errorMessages.push(error.response.data.message[property])
                }
              } else {
                this.errorMessages.push(error.response.data.message)
              }
  
              console.log(JSON.stringify(error.response.data.message))
            } else if (error.message) {
              this.errorMessages.push('Something went wrong. Please try again')
  
              console.log(JSON.stringify(error))
            }
          })
      }

    }
  }
});
</script>

<style scoped>
#loginForm {
  height: 100%;
}
</style>
