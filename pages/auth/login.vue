<template>
  <v-row align="center" justify="center" fill-height class="full-height">
    <v-col cols="12" sm="6" md="4" lg="3" xl="3" xxl="2">
      <v-card class="mx-auto pa-5 card-main">
        <div class="mb-5">
          <v-img height="75" src="@/assets/images/host-health-logo.png> </v-img>
        </div>
        <v-form ref="form">
          <v-text-field v-model="formData.email" variant="outlined" density="compact" :rules="usernameRules"
            label="Username" required></v-text-field>

          <v-text-field v-model="formData.password" variant="outlined" density="compact" :rules="passwordRules"
            type="password" label="Password" required></v-text-field>

          <div class="d-flex flex-column">
            <v-btn color="primary" class="mt-4" block @click="validate">
              Login
            </v-btn>

            <v-btn color="primary" variant="outlined" class="mt-4" block @click="reset">
              Reset
            </v-btn>

            <!-- <v-btn
            color="error"
            class="mt-4"
            block
            @click="reset"
          >
            Reset Form
          </v-btn>

          <v-btn
            color="warning"
            class="mt-4"
            block
            @click="resetValidation"
          >
            Reset Validation
          </v-btn> -->
          </div>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  setup() {
    definePageMeta({
      layout: "default",
      public: true,
      auth: {
        unauthenticatedOnly: true,
        navigateAuthenticatedTo: "/",
      },
    });
  },
  data() {
    return {
      formData: {
        email: "",
        password: "",
      },
      usernameRules: [
        (v) => !!v || "Username/Email is required",
        (v) => /.+@.+\..+/.test(v) || "Email must be valid",
      ],
      passwordRules: [
        (v) => !!v || "Password is required",
        // v => (v && v.length >= 8) || 'Password must be more than 8 characters',
        (v) => v && /^/.test(v),
        (v) =>
          (v && /(?=.*[0-9])/.test(v)) || "a digit must occur at least once",
        (v) =>
          (v && /(?=.*[a-z])/.test(v)) ||
          "a lower case letter must occur at least once",
        (v) =>
          (v && /(?=.*[A-Z])/.test(v)) ||
          "an upper case letter must occur at least once",
        (v) =>
          (v && /(?=.*[@#$%^&+=])/.test(v)) ||
          "a special character must occur at least once",
        (v) =>
          (v && /(?=\S+$)/.test(v)) ||
          "no whitespace allowed in the entire string",
        (v) =>
          (v && /.{8,}/.test(v)) || "anything, at least eight places though",
        (v) => v && /$/.test(v),
        // v => (v && /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/.test(v)) || 'At least one special character'
      ],
    };
  },
  mounted() {
    // console.log('ENV', process.env.NODE_ENV )
    // const { data, status, getSession } = useAuth()
    // console.log('status ', status.value)
    // console.log('getSession ', JSON.stringify(data))
  },
  methods: {
    async validate(e) {
      const { valid } = await this.$refs.form.validate();

      if (valid) {
        const { signIn } = useAuth();
        try {
          e.preventDefault();
          let res = await signIn({ ...this.formData }, { callbackUrl: "/" });
          console.log("res", res);
        } catch (error) {
          console.log("error", error);
        }
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
};
</script>
<style scoped>
.card-main {
  border: #13622a 1px solid;
}

.full-height {
  height: 100dvh;
}
</style>
