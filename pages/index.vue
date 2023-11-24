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
    fullscreen
    scrollable
  >
    <v-card>
      <!-- <v-card-title class="text-center">
        ใบสรุปยืนยันการเข้ารับบริการผู้ป่วยนอก
      </v-card-title> -->
      <v-card-text>
        <div id="printMe">
          <div class="print-format">
            <div class="mt-5 text-center">
              <img
                width="150"
                :src="logoUrl"
                class="ml-auto mr-auto"
                style="width: 150px !important;"
              />
              <br>
              <!-- <img
                :src="'data:image/jpeg;base64,'+ cardData.image"
                class="ml-auto mr-auto"
                style="width: 100px !important;"
              /> -->
            </div>
            <div class="mt-5 mb-5 text-center">
              <h2>
                ใบสรุปยืนยันการเข้ารับบริการผู้ป่วยนอก
              </h2>
            </div>
            <v-table
              :table-line-height="0"
              style="width: 100% !important;"
            >
              <tbody>
                <tr style="border-bottom: 0px !important;">
                  <td style="width: 20%; border-bottom: 0px !important; font-weight: bold;">ชื่อ - นามสกุล</td>
                  <td style="width: 30%; border-bottom: 0px !important;">{{ cardData.fname }} {{ cardData.lname }}</td>
                  <td style="width: 20%; border-bottom: 0px !important; font-weight: bold;">เลขบัตรประชาชน</td>
                  <td style="width: 30%; border-bottom: 0px !important;">{{ cardData.pid }}</td>
                </tr>
                <tr>
                  <td style="border-bottom: 0px !important; font-weight: bold;">วันเดือนปีเกิด</td>
                  <td style="border-bottom: 0px !important;">{{ convertThaiDate(cardData.birthDate) }}</td>
                  <td style="border-bottom: 0px !important; font-weight: bold;">อายุ</td>
                  <td style="border-bottom: 0px !important;">{{ cardData.age }}</td>
                </tr>
                <tr>
                  <td style="border-bottom: 0px !important; font-weight: bold;">วันที่รับบริการ</td>
                  <td style="border-bottom: 0px !important;">{{ convertThaiDateNow() }}</td>
                  <td style="border-bottom: 0px !important; font-weight: bold;">หน่วยให้บริการ</td>
                  <td style="border-bottom: 0px !important;">{{ cardData.hospMain.hcode !== '' ? `${cardData.hospMain.hcode} - ${ cardData.hospMain.hname }` : '' }}</td>
                </tr>
                <tr>
                  <td style="border-bottom: 0px !important; font-weight: bold;">หน่วยบริการประจำ</td>
                  <td style="border-bottom: 0px !important;">{{ typeof cardData.hospMainOp !== 'undefined' ? `${cardData.hospMainOp.hcode} - ${ cardData.hospMainOp.hname }` : '-' }}</td>
                  <td style="border-bottom: 0px !important; font-weight: bold;">หน่วยบริการปฐมภูมิ</td>
                  <td style="border-bottom: 0px !important;">{{ typeof cardData.hospSub !== 'undefined' ? `${cardData.hospSub.hcode} - ${ cardData.hospSub.hname }` : '-' }}</td>
                </tr>
                <tr>
                  <td style="border-bottom: 0px !important; font-weight: bold;">หน่วยบริการรับส่งต่อ</td>
                  <td style="border-bottom: 0px !important;">{{ typeof cardData.hospMain !== 'undefined' ? `${cardData.hospMain.hcode} - ${ cardData.hospMain.hname }` : '-' }}</td>
                  <td style="border-bottom: 0px !important; font-weight: bold;">สิทธิหลัก</td>
                  <td style="border-bottom: 0px !important;">{{ cardData.mainInscl }}</td>
                </tr>
                <tr>
                  <td style="border-bottom: 0px !important; font-weight: bold;">สิทธิย่อย</td>
                  <td style="border-bottom: 0px !important;">{{ cardData.subInscl !== '' ? cardData.subInscl : '' }}</td>
                  <td style="border-bottom: 0px !important; font-weight: bold;">จังหวัดที่ลงทะเบียนสิทธิ</td>
                  <td style="border-bottom: 0px !important;"></td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </div>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          variant="tonal"
          color="gray-darken-1"
          class="pl-5 pr-5"
          @click="dialog = false"
        >
          ปิด
        </v-btn>
        <!-- <v-btn
          color="green-darken-1"
          variant="tonal"
          prepend-icon="mdi-printer-outline"
          class="pl-5 pr-5"
          @click="print"
        >
          พิมพ์เอกสาร
        </v-btn> -->
        <v-btn
          color="green-darken-1"
          variant="tonal"
          prepend-icon="mdi-printer-outline"
          class="pl-5 pr-5"
          @click="printMe"
        >
          พิมพ์เอกสาร
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios'
import { usePaperizer } from 'paperizer'
import logoNhso from '@/assets/images/nhso.png'
export default {
  data() {
    return {
      output: null,
      logoUrl: logoNhso,
      dialog: false,
      loading: false,
      cardData: {}
    }
  },
  mounted () {
    // this.convertThaiDate(25260509)
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
        // console.log(response)
        this.cardData = response.data
        this.dialog = true
      // this.cardData = 
      } catch (error) {

      }
      this.loading = false
    },
    print () {
      // await this.$htmlToPaper('printMe');
      const { paperize } = usePaperizer('printMe', {
        styles: [
          'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
          '~/assets/css/print.css'
        ]
      }, this.closeDialog())
      paperize()
    },
    closeDialog () {
      this.dialog = false
    },
    printMe () {
      window.print()
    },
    convertThaiDate (birthDate) {
      // console.log(birthDate)
      const str = birthDate.toString()
      const yyyy = str.slice(0, 4)
      const mm = str.slice(4, 6)
      const dd = str.slice(6, 8)
      // console.log(dd)
      const date = new Date(yyyy-543, mm-1, dd)
      const result = date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        // weekday: 'long',
      })
      // console.log(result)
      return result
    },
    convertThaiDateNow () {
      // console.log(dd)
      const date = new Date()
      const result = date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        // weekday: 'long',
      })
      // console.log(result)
      return result
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

.print-format {
  padding: 10px 5px 10px 5px;
}

@media print {
  @page {
    font-size: 6px;
    size: A5 landscape;
    /* size: A5; */
    margin: 0mm;
    padding: 0mm;
  }
  .v-card-actions, .v-divider {
    display: none;
  }
  /* .print-format .copy {
    display: none;
  } */
}


</style>
