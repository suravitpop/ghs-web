<template>
  <v-row align="center" justify="center" fill-height class="full-height">
    <v-col cols="12" sm="6" md="6" lg="4" xl="4" xxl="4">
      <v-card class="pa-5 text-center">
        <v-img height="75" src="@/assets/images/logo.jpeg"></v-img>
        <v-card-title>กรุณาเสียบบัตรประจำตัวประชาชน</v-card-title>
        <v-icon
          v-if="!loading"
          size="128"
          color="grey-darken-2"
          icon="mdi-smart-card-outline"
        ></v-icon>
        <div v-else class="mt-5 mb-5">
          <div>
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
          <div class="mt-5">
            กำลังตรวจสอบข้อมูล
          </div>
        </div>
        <v-card-action>
          <v-btn color="primary" class="mt-4" block :disabled="loading" @click="getData()">
            ตรวจสอบข้อมูล
          </v-btn>
        </v-card-action>
      </v-card>
    </v-col>
  </v-row>
  <!-- <button @click="_signOut()">
    Sign Out
  </button> -->
</template>

<!-- <script setup lang="ts">
const route = useRoute()
const { signOut, token} = useAuth()
async function _signOut() {
  try {
    await signOut({
      callbackUrl: '/auth/login',
      redirect: true
    })
  } catch (error: any) {
    // toast.add({ severity: 'error', summary: 'error', detail: error?.data?.message || error?.message, life: 5000 });
  }
}
</script> -->
<script>
export default {
  data() {
    return {
      modal: false,
      loading: false,
      cardData: {}
    }
  },
  methods: {
    async _signOut () {
      const { signOut } = useAuth()
      try {
        await signOut({
          callbackUrl: '/auth/login',
          redirect: true
        })
      } catch (error) {
        // toast.add({ severity: 'error', summary: 'error', detail: error?.data?.message || error?.message, life: 5000 });
      }
    },
    getData () {
      this.loading = true
      this.cardData = {
        pid: '11xx8xx8xxxxx',
        titleName: '003',
        fname: 'สุรวิช',
        lname: 'ฉัตรพัฒน์',
        nation: '099',
        birthDate: '25360729',
        sex: 'ชาย',
        transDate: '2021-09-01T00:01:00',
        mainInscl: '(SSS) สิทธิประกันสังคม',
        subInscl: '(S1) สิทธิเบิกกองทุนประกันสังคม (ผู้ประกันตน)',
        age: '30 ปี 3 เดือน 13 วัน',
        checkDate: '2023-11-11T00:23:46',
        claimTypes: [
          {
            claimType: 'PG0060001',
            claimTypeName: 'เข้ารับบริการรักษาทั่วไป (OPD/ IPD/ PP)'
          },
          {
            claimType: 'PG0110001',
            claimTypeName: 'Self Isolation'
          },
          {
            claimType: 'PG0120001',
            claimTypeName: 'UCEP PLUS (ผู้ป่วยกลุ่มอาการสีเหลืองและสีแดง)'
          },
          {
            claimType: 'PG0130001',
            claimTypeName: 'บริการฟอกเลือดด้วยเครื่องไตเทียม (HD)'
          }
        ],
        image: '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',
        correlationId: 'aa8e3079-bed4-4595-9dd6-1f1aa82f8933',
        hospMain: {
          hcode: '11722',
          hname: 'รพ.มงกุฎวัฒนะ'
        },
        startDateTime: '2021-09-01T00:00:00'
      }

      this.loading = false
    }
  }
}
</script>
<style scoped>
.card-main {
  border: #13622a 1px solid;
}

.full-height {
  height: 100dvh;
}
</style>
