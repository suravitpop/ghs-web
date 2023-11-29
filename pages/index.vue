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
    class="ma-0 pa-0"
  >
    <v-card class="ma-0 pa-0">
      <!-- <v-card-title class="text-center">
        ใบสรุปยืนยันการเข้ารับบริการผู้ป่วยนอก
      </v-card-title> -->
      <v-card-text class="ma-0 pa-0">
        <div id="printMe">
          <div class="print-format">
            <div class="mt-2 text-center">
              <img
                width="100"
                :src="logoUrl"
                class="ml-auto mr-auto"
                style="width: 100px !important;"
              />
              <br>
              <!-- <img
                :src="'data:image/jpeg;base64,'+ cardData.image"
                class="ml-auto mr-auto"
                style="width: 100px !important;"
              /> -->
            </div>
            <div class="mt-3 mb-3 text-center">
              <h3>
                ใบสรุปยืนยันการเข้ารับบริการผู้ป่วยนอก
              </h3>
            </div>
            <div v-if="!flagSave">
              <v-alert v-model="alert" closable text="เกิดข้อผิดพลาดในการบันทึกข้อมูล" type="error" variant="tonal"></v-alert>
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
                    <td style="border-bottom: 0px !important; font-weight: bold;">วันที่และเวลารับบริการ</td>
                    <td style="border-bottom: 0px !important;">{{ convertThaiDateNow() }} (ssssss)</td>
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
                    <td style="border-bottom: 0px !important;">&nbsp;</td>
                  </tr>
                </tbody>
              </v-table>
              <v-form ref="form">
                <v-row>
                  <v-col>
                  <v-text-field
                    v-model="formData.mobile"
                    variant="outlined"
                    density="compact"
                    :rules="phoneRules"
                    label="เบอร์โทรศัพท์"
                    type="number"
                    
                     />
                  </v-col>
                  <v-col>
                    <v-select
                      v-model="formData.claimType"
                      label="ประเภทการเคลม"
                      :items="cardData.claimTypes"
                      :rules="claimTypeRules"
                      variant="outlined"
                      density="compact"
                      item-title="claimTypeName"
                      item-value="claimType"
                      required
                    >
                    <template #item="{ item, props: { onClick } }" >
                      <v-list-item style="font-size: 12px !important;" class="text-uppercase" @click="onClick">
                        {{ item.value }} - {{ item.title }}
                      </v-list-item>
                    </template>
                    <template #selection="dataSelection">
                      <div style="font-size: 12px;" class="text-uppercase">
                        {{ dataSelection.item.value }} - {{ dataSelection.item.title }}
                      </div>
                    </template>
                   </v-select>
                  </v-col>
                </v-row>
                <!-- <div class="text-center">
                  <v-btn
                    color="green-darken-1"
                    variant="tonal"
                    class="mt-4"
                    @click="validate"
                  >
                    บันทึกข้อมูล
                  </v-btn>
                </div> -->
              </v-form>
            </div>
            <div v-else>
              <v-table
                :table-line-height="0"
                style="width: 100% !important;"
              >
                <tbody>
                  <tr style="border-bottom: 0px !important;">
                    <td style="width: 20%; border-bottom: 0px !important; font-weight: bold;">ClaimCode</td>
                    <td style="width: 30%; border-bottom: 0px !important;">{{ saveClaimData.claimCode }}</td>
                    <td style="width: 20%; border-bottom: 0px !important; font-weight: bold;">บริการ</td>
                    <td style="width: 30%; border-bottom: 0px !important;">{{ claimTypeName }}</td>
                  </tr>
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
                    <td style="border-bottom: 0px !important; font-weight: bold;">เบอร์โทรศัพท์</td>
                    <td style="border-bottom: 0px !important;">{{ formData.mobile }}</td>
                  </tr>
                  <tr>
                    <td style="border-bottom: 0px !important; font-weight: bold;">วันที่และเวลารับบริการ</td>
                    <td style="border-bottom: 0px !important;">{{ convertThaiDateTime(saveClaimData.createdDate) }}</td>
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
                    <td style="border-bottom: 0px !important;">&nbsp;</td>
                  </tr>
                </tbody>
              </v-table>
            </div>
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
          @click="dialog=false"
        >
          ปิด
        </v-btn>
        <v-btn
          v-if="flagSave === true"
          color="green-darken-1"
          variant="tonal"
          prepend-icon="mdi-printer-outline"
          class="pl-5 pr-5"
          @click="printMe"
        >
          พิมพ์เอกสาร
        </v-btn>
        <v-btn
          v-else
          color="green-darken-1"
          variant="tonal"
          prepend-icon="mdi-content-save-outline"
          class="pl-5 pr-5"
          @click="validateSave"
        >
          บันทึกข้อมูล
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog
    v-model="dialogConfirm"
    persistent
    width="auto"
  >
    <v-card>
      <v-toolbar
        color="primary"
        title="ยืนยันการบันทึกข้อมูล"
      ></v-toolbar>
      <v-card-text>
        คุณต้องการบันทึกข้อมูลใช้หรือไม่? หากใช่กดปุ่ม "ยืนยัน" หากไม่ใช้กดปุ่ม "ยกเลิก"
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          variant="tonal"
          color="gray-darken-1"
          class="pl-5 pr-5"
          @click="dialogConfirm=false"
        >
          ยกเลิก
        </v-btn>
        <v-btn
          color="green-darken-1"
          variant="tonal"
          class="pl-5 pr-5"
          @click="confirmSave"
        >
          ยืนยัน
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-snackbar
      v-model="snackbar"
      vertical
    >
      <div class="text-subtitle-1 pb-2">This is a snackbar message</div>

      <p>This is a longer paragraph explaining something</p>

      <template v-slot:actions>
        <v-btn
          color="primary"
          variant="text"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
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
      dialogConfirm: false,
      loading: false,
      cardData: {},
      phoneNumber: '',
      cliamType: '',
      claimTypeName: '',
      correlationId: '',
      flagSave: false,
      formData: {
        pid: '',
        mobile: '',
        claimType: '',
        correlationId: '',
        hn: '',
        hcode: ''
      },
      saveClaimData: {},
      phoneRules: [
        (v) => !!v || "กรุณากรอกหมายเลขโทรศัพท์",
        v => (v && v.length === 10) || 'หมายเลขโทรศัพท์ต้องมี 10 หลัก'
      ],
      claimTypeRules: [
        (v) => !!v || "กรุณาเลือกประเภทการเคลม",
      ],
      alert: false
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
        this.formData.pid = response.data.pid
        this.formData.correlationId = response.data.correlationId
        this.formData.hcode = response.data.hospMain.hcode
        this.dialog = true
        // try make default
       this.formData.claimType = response.data.claimTypes[0].claimType
        this.formData.mobile = "0000000000"
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
      this.claimTypeName = ''
      this.cardData = {}
      this.formData = {
        pid: '',
        mobile: '',
        claimType: '',
        correlationId: '',
        hn: '',
        hcode: ''
      }
    },
    printMe () {
      window.print()
    },
    async validateSave (e) {
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        try {
          e.preventDefault();
          this.dialogConfirm = true
        } catch (error) {
          console.log("error", error);
        }
      }
    },
    async confirmSave () {
      const payload = this.formData
      try {
        const response = await axios.post(`/api_local/api/nhso-service/confirm-save`, payload)
        // console.log(response)
        this.saveClaimData = response.data
        this.flagSave = true
        // find service
        const cardData = this.cardData
        const name = cardData.claimTypes.filter(v => v.claimType === response.data.claimType)
        this.claimTypeName = name[0].claimType + ' - ' + name[0].claimTypeName
        // console.log('name ', name)
      } catch (error) {
        this.alert = true
      }
      this.dialogConfirm = false
      // this.flagSave = true
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
    },
    convertThaiDateTime (createdDated) {
      // console.log(birthDate)
      const str = createdDated.toString()
      // const yyyy = str.slice(0, 4)
      // const mm = str.slice(4, 6)
      // const dd = str.slice(6, 8)
      // console.log(dd)
      const date = new Date(str)
      const result = date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
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
    font-size: 3px;
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
