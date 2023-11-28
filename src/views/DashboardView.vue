<template>
  <v-layout class="rounded rounded-md">

    <v-main class="d-flex align-center justify-center">
      <v-app-bar :elevation="6" rounded>
        <v-app-bar-nav-icon>

          <v-dialog transition="dialog-top-transition" width="auto" @click:outside="restartEditForm()">
            <template v-slot:activator="{ props }">
              <v-avatar icon="$vuetify" image="https://cdn.vuetifyjs.com/images/john-smirk.png" size="40"
                v-bind="props"></v-avatar>
            </template>
            <template v-slot:default="{ isActive }">
              <v-card class="py-5" min-width="400px">
                <v-row>
                  <v-col cols="2" class="offset-10">
                    <v-icon icon="mdi-close" @click="isActive.value = false; restartEditForm()"></v-icon>
                  </v-col>
                </v-row>
                <v-row class="px-4 align-center text-center">
                  <v-col cols="12" class="py-0 justify-center align-center text-center">
                    <v-avatar icon="$vuetify" image="https://cdn.vuetifyjs.com/images/john-smirk.png" size="150">
                    </v-avatar>
                  </v-col>
                </v-row>
                <v-card-title class="text-center mt-5">
                  <p>YOUR ACCOUNT</p>
                </v-card-title>

                <v-card-text class="py-5">
                  <v-row class="align-center text-center justify-center">

                    <v-col cols="10" class="">
                      <!-- Username -->
                      <v-row>
                        <v-col cols="12" class="float-start px-0">
                          <v-text-field v-model="updatedUser.username" variant="underlined" label="Username" required
                            hide-details></v-text-field>
                        </v-col>
                      </v-row>
                      <!-- Email -->
                      <v-row>
                        <v-col cols="12" class="float-start px-0">
                          <v-text-field v-model="updatedUser.email" variant="underlined" label="Email" required
                            hide-details></v-text-field>
                        </v-col>
                      </v-row>
                      <!-- Phone Number -->
                      <v-row>
                        <v-col cols="12" class="float-start px-0">
                          <v-text-field v-model="updatedUser.phoneNumber" variant="underlined" label="Phone number"
                            required hide-details></v-text-field>
                        </v-col>
                      </v-row>
                    </v-col>

                    <!-- <v-col cols="4" class="text-end">
                      <v-btn v-if="areEditFieldsDisabled" @click="toogleEditFields()" icon="mdi-pencil" elevation="0"></v-btn>
                      <v-btn v-if="!areEditFieldsDisabled" @click="updateUser()">SAVE</v-btn>
                    </v-col> -->

                  </v-row>
                </v-card-text>

                <v-card-actions class="justify-end">
                  <v-row class="justify-center align-center text-center">
                    <v-col cols="10">
                      <v-btn id="btn-delete-account" class="bg-black mb-5" elevation="2" density="comfortable" block
                        color="#000" @click="updateUser()">Save changes</v-btn>

                      <v-dialog transition="dialog-top-transition" width="auto">
                        <template v-slot:activator="{ props }">
                          <v-btn class="mx-0" id="btn-delete-account" variant="tonal" elevation="0" v-bind="props"
                            density="comfortable" block color="#c90000">Delete account</v-btn>
                        </template>
                        <template v-slot:default="{ isActive }">
                          <v-card>
                            <v-card-title>
                              <p>
                                Do you really want to delete your account?
                              </p>
                            </v-card-title>

                            <v-card-actions class="justify-end">
                              <v-btn variant="text" @click="deleteUser(); isActive = false">YES, DELETE MY ACCOUNT</v-btn>
                              <v-btn variant="text" @click="isActive.value = false">CANCEL</v-btn>

                            </v-card-actions>
                          </v-card>
                        </template>
                      </v-dialog>
                    </v-col>
                  </v-row>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>

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

      <v-container>
        <v-row class="justify-center">
          <v-col cols="12" sm="8" md="6" lg="4" v-for="(task, index) in tasks" :key="index" :title="task.title">
            <v-card :elevation="{ 4: task.status === 'PENDING', 0: task.status === 'DONE' }"
              :class="{ 'done-card': task.status === 'DONE' }">
              <v-card-text id="card-text" class="pb-0">
                <v-row>
                  <v-col cols="10">
                    <h2>{{ task.title }}</h2>
                  </v-col>
                  <v-col cols="2 text-end">
                    <v-dialog transition="dialog-top-transition" width="auto">
                      <template v-slot:activator="{ props }">
                        <v-icon :class="{ 'icon-pending-delete': task.status === 'PENDING' }"
                          v-bind="props" icon="mdi-delete"></v-icon>
                      </template>
                      <template v-slot:default="{ isActive }">
                        <v-card>
                          <v-card-title>
                            <p>
                              Do you want to delete this task?
                            </p>
                          </v-card-title>

                          <v-card-actions class="justify-end">
                            <v-btn variant="text" @click="deleteTask(task.taskId, index); isActive.value = false">DELETE</v-btn>
                            <v-btn variant="text" @click="isActive.value = false">CANCEL</v-btn>

                          </v-card-actions>
                        </v-card>
                      </template>
                    </v-dialog>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <p>{{ task.description }}</p>
                  </v-col>
                </v-row>
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
                <v-chip v-bind="props" @click="createTask" id="new-task-chip" prepend-icon="mdi-plus" variant="elevated"
                  size="x-large">
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
                      <v-btn type="submit" @click="createTask() ; isActive.value = false" block
                        class="btn btn-success mt-2">CREATE</v-btn>
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
      config: {
        headers: {
          'api_token': localStorage.getItem('token')
        }
      },
      updatedUser: {
        username: '',
        email: '',
        phoneNumber: ''
      },
      areEditFieldsDisabled: true,
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

      this.updatedUser = {
        username: this.user.username,
        email: this.user.email,
        phoneNumber: this.user.phoneNumber
      }
    }
    document.title = `${this.user.username} | Dashboard `

    this.getTasks()
  },
  methods: {
    toogleEditFields() {
      this.areEditFieldsDisabled = !this.areEditFieldsDisabled
    },
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

      const dataToUpdate = {
        status: currentStatus
      }

      await axios.patch(`http://localhost:3000/api/tasks/${taskId}`, dataToUpdate, this.config)
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

      await axios.post('http://localhost:3000/api/tasks', this.newTask, this.config)
        .then((response) => {
          console.log(response.data)

          this.newTask.title = ''
          this.newTask.description = ''

          this.getTasks()
        })
        .catch(error => {
          console.error(error)
        })
    },
    async updateUser() {
      if (
        this.user.username === this.updatedUser.username
        && this.user.email === this.updatedUser.email
        && this.user.phoneNumber === this.updatedUser.phoneNumber
      ) {
        this.toogleEditFields();
        return;
      }

      await axios.patch('http://localhost:3000/api/users', this.updatedUser, this.config)
        .then((response) => {
          this.user.username = this.updatedUser.username;
          this.user.email = this.updatedUser.email;
          this.user.phoneNumber = this.updatedUser.phoneNumber;

          console.log(response);

          this.toogleEditFields();
        })
        .catch(error => {
          this.updatedUser.username = this.user.username;
          this.updatedUser.email = this.user.email;
          this.updatedUser.phoneNumber = this.user.phoneNumber;
          console.log(error);
        })
    },
    async deleteUser() {
      await axios.delete('http://localhost:3000/api/users', this.config)
        .then((response) => {
          console.log(response)
          this.$router.push({
            name: 'home'
          });
        });
    },
    async deleteTask(taskId, index) {
      await axios.delete(`http://localhost:3000/api/tasks/${taskId}`, this.config)
        .then((response) => {
          console.log(response);
          this.tasks.splice(index, 1);
        })
        .catch(error => {
          console.log(error)
        })
    },
    logout() {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      this.$router.push({
        name: 'home'
      })
    },
    restartEditForm() {
      this.updatedUser.username = this.user.username;
      this.updatedUser.email = this.user.email;
      this.updatedUser.phoneNumber = this.user.phoneNumber;
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

#new-task-chip {
  position: fixed;
  bottom: 50px;
  right: 50px;
}

#pencil-icon {
  opacity: 0.3;
}

#pencil-icon:hover {
  opacity: 1;
}

#btn-delete-account {
  opacity: 0.5;
}

#btn-delete-account:hover {
  opacity: 1;
}

.done-card {
  background-color: rgb(2, 51, 32);
  color: white;
  opacity: 0.5;
}

.icon-pending-delete {
  opacity: 0.1;
}

.icon-pending-delete:hover {
  opacity: 1;
}
</style>