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
  <v-dialog
    v-model="dialog"
    persistent
    scrollable
    max-width="800"
  >
    <v-card>
      <!-- <v-card-title class="text-center">
        ใบสรุปยืนยันการเข้ารับบริการผู้ป่วยนอก
      </v-card-title> -->
      <v-card-text>
        <div id="printMe">
          <div class="mt-5 text-center">
            <v-img
              width="150"
              :src="logoUrl"
              class="ml-auto mr-auto"
            />
          </div>
          <div class="mt-5 text-center">
            <h3>
              ใบสรุปยืนยันการเข้ารับบริการผู้ป่วยนอก
            </h3>
          </div>
          <v-table
            :table-line-height="0"
            style="width: 100% !important;"
          >
            <tbody>
              <tr style="border-bottom: 0px !important;">
                <td style="border-bottom: 0px !important;">ชื่อ - นามสกุล</td>
                <td style="border-bottom: 0px !important;">{{ cardData.fname }} {{ cardData.lname }}</td>
                <td style="border-bottom: 0px !important;">เลขบัตรประชาชน</td>
                <td style="border-bottom: 0px !important;">{{ cardData.pid }}</td>
              </tr>
              <tr>
                <td style="border-bottom: 0px !important;">วันที่รับบริการ</td>
                <td style="border-bottom: 0px !important;"></td>
                <td style="border-bottom: 0px !important;">หน่วยให้บริการ</td>
                <td style="border-bottom: 0px !important;">{{ cardData.hospMain.hcode }} - {{ cardData.hospMain.hname }}</td>
              </tr>
              <tr>
                <td style="border-bottom: 0px !important;">หน่วยบริการประจำ</td>
                <td style="border-bottom: 0px !important;">{{ cardData.hospMain.hcode }} - {{ cardData.hospMain.hname }}</td>
                <td style="border-bottom: 0px !important;">หน่วยบริการปฐมภูมิ</td>
                <td style="border-bottom: 0px !important;">{{ cardData.hospMain.hcode }} - {{ cardData.hospMain.hname }}</td>
              </tr>
              <tr>
                <td style="border-bottom: 0px !important;">หน่วยบริการรับส่งต่อ</td>
                <td style="border-bottom: 0px !important;">{{ cardData.hospMain.hcode }} - {{ cardData.hospMain.hname }}</td>
                <td style="border-bottom: 0px !important;">สิทธิหลัก</td>
                <td style="border-bottom: 0px !important;">{{ cardData.mainInscl }}</td>
              </tr>
              <tr>
                <td style="border-bottom: 0px !important;">สิทธิย่อย</td>
                <td style="border-bottom: 0px !important;">{{ cardData.subInscl }}</td>
                <td style="border-bottom: 0px !important;">จังหวัดที่ลงทะเบียนสิทธิ</td>
                <td style="border-bottom: 0px !important;">{{ cardData.pid }}</td>
              </tr>
            </tbody>
          </v-table>
        </div>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green-darken-1"
          variant="text"
          @click="dialog = false"
        >
          ปิด
        </v-btn>
        <v-btn
          color="green-darken-1"
          variant="text"
          @click="print"
        >
          พิมพ์เอกสาร
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios'
import logoNhso from '@/assets/images/nhso.png'
export default {
  data() {
    return {
      logoUrl: logoNhso,
      dialog: false,
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
    async getData () {
      const config = useRuntimeConfig()
      this.loading = true
      try {
        const response = await axios.get(`/api_local/api/smartcard/read?readImageFlag=true`)
        console.log(response)
        this.cardData = response.data
        this.dialog = true
      // this.cardData = 
      } catch (error) {

      }
      this.loading = false
    },
    async print () {
      // Pass the element id here
      await this.$htmlToPaper('printMe');
    },
    printMe () {
      window.print()
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

@media print {
  @page {
    size: landscape
  }
}
</style>
