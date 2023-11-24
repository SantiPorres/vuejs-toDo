<template>
  <v-layout class="rounded rounded-md">

    <v-main class="d-flex align-center justify-center">
      <v-app-bar :elevation="6" rounded>
        <v-app-bar-nav-icon>
          <v-avatar icon="$vuetify" image="https://cdn.vuetifyjs.com/images/john-smirk.png" size="40"></v-avatar>
        </v-app-bar-nav-icon>
        <v-app-bar-title>
          <p class="ms-1">Welcome {{ user.username }}</p>
        </v-app-bar-title>
        <v-col cols="auto">
          <v-dialog transition="dialog-top-transition" width="auto">
            <template v-slot:activator="{ props }">
              <v-btn color="primary" v-bind="props">
                Log out</v-btn>
            </template>
            <template v-slot:default="{ isActive }">
              <v-card>
                <v-card-title>
                  <p>
                    Do you really want to log out?
                  </p>
                </v-card-title>

                <v-card-actions class="justify-end">
                  <v-btn variant="text" @click="logout(); isActive = false">YES, I'M SURE</v-btn>
                  <v-btn variant="text" @click="isActive.value = false">CANCEL</v-btn>

                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </v-col>
      </v-app-bar>

      <v-container fluid>
        <v-row class="">
          <v-col cols="12" sm="5" md="4" lg="3" v-for="(task, index) in tasks" :key="index" :title="task.title">
            <v-card elevation="4">
              <v-card-title>
                <v-row>
                  <v-col cols="12">
                    <h3>{{ task.title }}</h3>
                  </v-col>
                </v-row>
              </v-card-title>
              <v-card-text id="card-text" class="pb-0">
                <p>{{ task.description }}</p>
              </v-card-text>
              <v-card-actions>
                <v-checkbox label="DONE" :model-value="task.status === 'PENDING' ? false : true"
                  @click="updateStatus(task.taskId, task.status, index)">
                </v-checkbox>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="auto">
            <v-dialog transition="dialog-top-transition" width="auto">
              <template v-slot:activator="{ props }">
                <v-chip v-bind="props" @click="createTask" id="fixed-bottom-right" prepend-icon="mdi-plus"
                  variant="elevated">
                  New task
                </v-chip>
              </template>
              <template v-slot:default="{ isActive }">
                <v-card>
                  <v-card-title>
                    <p>
                      Create task
                    </p>
                  </v-card-title>

                  <v-sheet width="300" class="mx-5">
                    <v-form fast-fail @submit.prevent>
                      <v-text-field v-model="newTask.title" label="Title"></v-text-field>

                      <v-textarea v-model="newTask.description" label="Description"></v-textarea>

                    </v-form>
                  </v-sheet>
                  
                  <v-card-actions class="justify-end">
                    <v-col cols="12">
                      <v-btn type="submit" @click="createTask() ; isActive.value = false" block class="btn btn-success mt-2">CREATE</v-btn>
                      <v-btn class="mx-0 px-0" block @click="isActive.value = false">CANCEL</v-btn>
                    </v-col>


                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </v-col>
        </v-row>

      </v-container>
    </v-main>
  </v-layout>
</template>

<script>

import axios from 'axios';

export default {
  name: 'DashboardView',
  data() {
    return {
      tasks: [],
      user: {},
      newTask: {
        title: '',
        description: '',
        status: 'PENDING'
      }
    }
  },
  mounted() {
    
    const userString = localStorage.getItem('user');
    if (userString) {
      this.user = JSON.parse(userString);
    }
    document.title = `${this.user.username} | Dashboard `

    this.getTasks()
  },
  methods: {
    async getTasks() {
      const config = {
        headers: {
          'api_token': localStorage.getItem('token')
        }
      }

      await axios.get('http://localhost:3000/api/tasks', config)
        .then((response) => {
          this.tasks = response.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    async updateStatus(taskId, currentStatus, index) {
      const config = {
        headers: {
          'api_token': localStorage.getItem('token')
        }
      }

      const dataToUpdate = {
        status: currentStatus
      }

      await axios.patch(`http://localhost:3000/api/tasks/${taskId}`, dataToUpdate, config)
        .then((response) => {
          console.log(response)
          console.log(currentStatus)
          console.log('Status modified')

          if (currentStatus === 'PENDING') {
            this.tasks[index].status = 'DONE'
          }
          if (currentStatus === 'DONE') {
            this.tasks[index].status = 'PENDING'
          }

        })
        .catch(error => {
          console.error(error)
          console.error('Could not update task status')
        })
    },
    async createTask() {
      const config = {
        headers: {
          'api_token': localStorage.getItem('token')
        }
      }

      await axios.post('http://localhost:3000/api/tasks', this.newTask, config)
        .then((response)=> {
          console.log(response.data)

          this.newTask.title = ''
          this.newTask.description = ''

          this.getTasks()
        })
        .catch(error => {
          console.error(error)
        })
    },
    logout() {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      this.$router.push({
        name: 'home'
      })
    }
  }
}

</script>

<style>
.v-input__details {
  display: none;
}

#card-text {
  margin-bottom: 0;
}

#fixed-bottom-right {
  position: fixed;
  bottom: 16px;
  right: 16px;
}
</style>