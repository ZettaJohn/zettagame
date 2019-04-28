import React, { Component } from 'react';
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FastForward from '@material-ui/icons/FastForward';
import OpenInNew from '@material-ui/icons/OpenInNew';
import Replay from "@material-ui/icons/Replay"
import { withStyles } from '@material-ui/core/styles';
import * as bs4 from "reactstrap"

const hiscale = require("../assets/sound/3.HISCALE.mp3")
const ding = require("../assets/sound/ding.mp3")
const sad = require("../assets/sound/19.SAD VIOLIN.mp3")
const $ = require("jquery")
const moment = require("moment")
const getYear = moment().format("YYYY")
const testBox = [
    { box_id: 1 }, { box_id: 1 }, { box_id: 1 },
    { box_id: 1 }, { box_id: 1 }, { box_id: 1 },
    { box_id: 1 }, { box_id: 1 }, { box_id: 1 },
    { box_id: 1 }, { box_id: 1 }, { box_id: 1 },
    { box_id: 1 }, { box_id: 1 }, { box_id: 1 },
]
const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        position: 'absolute',
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
})
class RandomGame extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataBox: testBox,
            showBox: [],
            mysticBox: [],
            dataMysticBox: [],
            label_qty: "",
            label_danger: "",
            con_01: "",
            con_02: "",
            con_03: "",
            con_04: "",
            con_05: "",
            alertOpen: false,
            modalHeader: "",
            modalBody: "",
        }
    }
    componentDidMount() {
        // $(".inputForm").hide()
        $(".gameForm").hide()
        // this._setBoxContent(this)
    }
    _selectedBox(self, box_id) {
        var data_box = self.state.dataBox
        var getIndex = self._getIndexArray(box_id, data_box, "box_id")
        if (data_box[getIndex].box_open == 0) {
            var getBoxName = data_box[getIndex].box_name
            var checkDanger = data_box[getIndex].box_danger
            var audioDing = new Audio(ding)
            var audioSad = new Audio(sad)
            var newObj = {
                box_id: box_id,
                box_danger: checkDanger,
                box_name: getBoxName,
                box_open: 1
            }
            if (checkDanger == 1) {
                $("#" + box_id).addClass("flip-box")
                $("#labelContent" + box_id).addClass("hover")
                setTimeout(() => {
                    $("#" + box_id).html("").removeClass().addClass("img-logo-danger")
                    $("#boxContent" + box_id).removeClass().addClass("boxContentOpened")
                    audioSad.play()
                    this.setState({
                        alertOpen: true,
                        modalHeader: "Alert Box",
                        modalBody: getBoxName,
                    })
                }, 500)
            } else {
                $("#" + box_id).addClass("flip-box")
                $("#labelContent" + box_id).addClass("hover")
                setTimeout(() => {
                    $("#" + box_id).html("").removeClass().addClass("img-logo-zettaEdit")
                    $("#boxContent" + box_id).removeClass().addClass("boxContentOpened")
                    audioDing.play()
                    this.setState({
                        alertOpen: true,
                        modalHeader: "Alert Box",
                        modalBody: getBoxName,
                    })
                }, 500)
            }
            data_box.splice(getIndex, 1, newObj)
            self.setState({ dataBox: data_box })
        } else {
            return false
        }
    }
    async _setBoxContent(self) {
        var labelQty = self.state.label_qty
        var data_con = self.state.dataCon
        var arr_box = [], arr_data = []
        for (var i = 0; i < labelQty; i++) {
            arr_box.push(
                <Grid item xs={2} >
                    <Paper id={"boxContent" + i} className="boxContent"  >
                        <Paper id={"labelContent" + i} className="labelContent" >
                            <div className="first-label flip-box-inner" id={i} onClick={(e) => this._selectedBox(self, e.target.id)} >
                                {(i + 1)}<br />
                                {'Seminar ' + getYear}
                            </div>
                        </Paper>
                    </Paper>
                </Grid>
            )
            var checkDanger = self._findValueInArrayObject(i, data_con, "danger")
            var box_danger = (checkDanger) ? 1 : 0
            var box_name = await self._randomName(box_danger)
            // console.log("box_name", box_name)
            arr_data.push({
                box_id: i,
                box_danger: box_danger,
                box_name: box_name,
                box_open: 0
            })
        }
        self.setState({
            showBox: arr_box,
            dataBox: arr_data
        })
    }
    async _setMysticBoxContent(self) {
        var mysticQty = 5, arr_box = [], arr_data = []
        for (var i = 0; i < mysticQty; i++) {
            arr_box.push(
                <Grid item xs={2} >
                    <Paper id={"mysticBoxContent" + i} className="mysticBoxContent"  >
                        <Paper id={"mysticLabelContent" + i} className="mysticLabelContent" >
                            <div className="mysticBox" id={"mysticBox" + i} onClick={(e) => this._selectedMysticBox(self, e.target.id)} >
                                <p id={"textMystic" + i} className="textMystic" >{'?'}</p>
                            </div>
                        </Paper>
                    </Paper>
                </Grid>
            )
        }
        var arr_data = await self._randomMystic(self)
        self.setState({
            mysticBox: arr_box,
            dataMysticBox: arr_data
        })
    }
    _selectedMysticBox(self, mysticBox_id) {
        var data_box = self.state.dataMysticBox
        var getID = mysticBox_id.substring(mysticBox_id.length - 1, mysticBox_id.length)
        var getIndex = self._getIndexArray(getID, data_box, "mysticBox_id")
        console.log("object", data_box);
        if (data_box[getIndex].mysticBox_open == 0) {
            var getName = data_box[getIndex].mysticBox_name
            var audioHiscale = new Audio(hiscale)
            var newObj = {
                mysticBox_id: getID,
                mysticBox_con: data_box[getIndex].mysticBox_con,
                mysticBox_name: getName,
                mysticBox_open: 1
            }
            audioHiscale.play()
            $("#" + mysticBox_id).html("☺").addClass("textMysticOpened")
            $("#mysticBoxContent" + getID).removeClass().addClass("mysticBoxContentOpened")
            self.setState({
                alertOpen: true,
                modalHeader: "Alert Box",
                modalBody: getName,
            })
        } else {
            return false;
        }
        data_box.splice(getIndex, 1, newObj)
        self.setState({
            dataMysticBox: data_box
        })
    }
    _changeForm = (e) => {
        var id = e.target.id
        var val = e.target.value
        this.setState({ [id]: val })
    }
    _startGame = () => {
        var labelQty = this.state.label_qty
        var labelDanger = this.state.label_danger
        var checkLabelQty = this._checkRegNumber(labelQty)
        var checkLabelDanger = this._checkRegNumber(labelDanger)
        if (checkLabelQty && checkLabelDanger) {
            var arr_set = this._randomCondition(this, labelQty, labelDanger)
            this.setState({
                dataCon: arr_set
            }, () => {
                this._setBoxContent(this)
                this._setMysticBoxContent(this)
            })
            $(".inputForm").hide("slow")
            $(".gameForm").show("slow")
        } else {
            this.setState({
                alertOpen: true,
                modalHeader: "Alert Box",
                modalBody: 'กรุณากรอก "จำนวนป้าย" และ "ป้ายโดน" ก่อนเริ่มเกมส์',
            })
            return false
        }
    }
    _reStartGame = () => {
        var labelQty = this.state.label_qty
        var labelDanger = this.state.label_danger
        var checkLabelQty = this._checkRegNumber(labelQty)
        var checkLabelDanger = this._checkRegNumber(labelDanger)
        if (checkLabelQty && checkLabelDanger) {
            var arr_set = this._randomCondition(this, labelQty, labelDanger)
            this.setState({
                showBox: [],
                mysticBox:[],
                dataCon: arr_set
            }, () => {
                this._setBoxContent(this)
                this._setMysticBoxContent(this)
            })
        } else {
            return false
        }
    }
    _checkRegNumber(str) {
        var reg = new RegExp('^[0-9]+$')
        return reg.test(str)
    }
    _randomName(conDanger) {
        return new Promise((reslove) => {
            var arrSafe = ["อยู่รอดปลอดภัย คนต่อไปเชิญ Y-Y", "ยัง ยังไม่ใช่นะจ๊ะ!", "เสียใจมันไม่ช่ายยอะ ^-^", "กองแช่งทั้งหลายรอไปก่อนนะ ยังไม่ใช่จ๊ะ", "อยากจะให้โดนเหลือเกิน แต่ยังไม่ใช่อะ", "กดกี่ทีก็ไม่โดนเนอะ หุ หุ", "ผ่านเลยจ้า", "ไม่โดนจ้า ไม่โดน ^-^", "เปิดแต่ ไม่โดน อะเยอะเราอะ -o-", "เบื่อจริงคนดวงดี -_-"]
            var arrDanger = ["โดนแล้วจ้า จัดไปสิ!", "ยัง ยังไม่รู้ตัวอีก คุณนั้นแหละโดน!", "โดนแล่ว! โดนแล่ว!", "พอ พอก่อนไหม โดนอีกและ", "เอะ อะ เอะ อะ ก็โดน!", "ด ด ด ดะ โดน!!", "รู้ว่าเหนื่อย โดน โดน ไปซะ", "โดนแล้ว อย่าช้าที", "ยาวไป โดน ยาวไป", "โดนก่อน ไม่รอแล้วนะ"]
            if (conDanger === 1) {
                var randName = Math.floor(Math.random() * Math.floor(arrDanger.length))
                reslove(arrDanger[(randName)])
            } else {
                var randName = Math.floor(Math.random() * Math.floor(arrDanger.length))
                reslove(arrSafe[(randName)])
            }
        })
    }
    _randomCondition(self, qtyAll, qtyUsed) {
        var arr_data = []
        for (var i = 0; i < qtyUsed; i++) {
            var checkAlready = 0
            var rand_con = 0
            do {
                rand_con = rand_con = Math.floor(Math.random() * Math.floor(qtyAll))
                var checkRand = self._findValueInArrayObject(rand_con, arr_data, "danger")
                checkAlready = (checkRand == true) ? 0 : checkAlready + 1
            }
            while (checkAlready < 1)
            arr_data.push({
                danger: rand_con
            })
        }
        return arr_data
    }
    _randomMystic(self) {
        var arr_data = []
        for (var i = 1; i <= 5; i++) {
            var checkAlready = 0
            var rand_con = 0, rand_name = ""
            do {
                rand_con = rand_con = Math.floor(Math.random() * Math.floor(5))
                var checkRand = self._findValueInArrayObject(rand_con, arr_data, "mysticBox_con")
                rand_name = self.state['con_0' + (rand_con + 1)]
                checkAlready = (checkRand == true) ? 0 : checkAlready + 1
            }
            while (checkAlready < 1)
            arr_data.push({
                mysticBox_id: i,
                mysticBox_con: rand_con,
                mysticBox_name: rand_name,
                mysticBox_open: 0
            })
        }
        return arr_data
    }
    _alertCancel = () => {
        this.setState({ alertOpen: false })
    }
    _findValueInArrayObject(val = "", arr = [], prop = "") {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][prop] === val) {
                return true
            }
        }
        return false
    }
    _getIndexArray(val = "", arr = [], prop = "") {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][prop] == val) {
                return i
            }
        }
        return -1
    }
    _newGame = () => {
        window.location.reload()
    }
    render() {
        const { classes } = this.props;
        return (
            <div className="bg-default" >
                <AppBar position="static">
                    <Toolbar >
                        <Typography className={classes.grow} variant="h6" color="inherit">
                            <div className="img-logo-zetta" ></div>
                        </Typography>
                        <div >
                            <Button variant="contained" size="small" color="inherit" className="btn-newGame" onClick={this._newGame} >
                                <OpenInNew className="icon-left icon-large" />New Game
                            </Button>
                        </div>
                        <div >
                            <Button variant="contained" size="small" color="inherit" className="btn-reStart" onClick={this._reStartGame} >
                                <Replay className="icon-left icon-large" />RESTART
                            </Button>
                        </div>
                    </Toolbar>
                </AppBar>
                <Grid className="inputForm" container direction="row" justify="center" alignItems="center" spacing={16} >
                    <Grid item style={{ textAlign: "center" }} xs={9}>
                        <Paper style={{ margin: "15px 0px 15px 0px", padding: "15px 15px 15px 15px" }} >
                            <Grid item xs={12}>
                                <h1>ป้ายหรรษา</h1>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    style={{ width: "500px" }}
                                    required
                                    id="label_qty"
                                    label="จำนวนป้าย"
                                    className=""
                                    margin="normal"
                                    onChange={this._changeForm}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    style={{ width: "500px" }}
                                    required
                                    id="label_danger"
                                    label="ป้ายโดน"
                                    className=""
                                    margin="normal"
                                    onChange={this._changeForm}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    style={{ width: "500px" }}
                                    required
                                    id="con_01"
                                    label="เงื่อนไข 1 "
                                    className=""
                                    margin="normal"
                                    onChange={this._changeForm}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    style={{ width: "500px" }}
                                    required
                                    id="con_02"
                                    label="เงื่อนไข 2 "
                                    className=""
                                    margin="normal"
                                    onChange={this._changeForm}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    style={{ width: "500px" }}
                                    required
                                    id="con_03"
                                    label="เงื่อนไข 3 "
                                    className=""
                                    margin="normal"
                                    onChange={this._changeForm}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    style={{ width: "500px" }}
                                    required
                                    id="con_04"
                                    label="เงื่อนไข 4 "
                                    className=""
                                    margin="normal"
                                    onChange={this._changeForm}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    style={{ width: "500px" }}
                                    required
                                    id="con_05"
                                    label="เงื่อนไข 5 "
                                    className=""
                                    margin="normal"
                                    onChange={this._changeForm}
                                />
                            </Grid>
                            <Grid item xs={12} >
                                <center>
                                    <p className="howtoplay">
                                        *วิธีเล่น : ใส่ตัวเลขจำนวนป้าย และป้ายโดน โดยการกำหนดนั้นให้จำนวนของป้ายมากกว่าป้ายโดนเสมอ<br />เช่น จำนวนป้าย 10 ป้ายโดน 1 จะเท่ากันโอกาสโดน 1 ต่อ 10
                                และตัวเกมส์สามารถใส่เงื่อนไขต่าง ๆ<br /> ที่ต้องการให้ผู้โดนทำตามเช่น ให้กินโก๋แก่วาซาบิ 1 ช้อนโต๊ะ
                                                        ขอให้สนุกกับเกมส์ป้ายหรรษานะ ^-^
                            </p>
                                </center>
                            </Grid>
                            <Grid item xs={12} style={{ margin: "15px 0px 0px 15px" }}  >
                                <Button variant="contained" size="small" className="btn-start" color="primary" onClick={this._startGame} >
                                    <FastForward className="icon-left icon-large" />
                                    Start Game
                                </Button>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid className="gameForm" container spacing={16} >
                    <Grid item xs={1}></Grid>
                    {this.state.mysticBox}
                    <Grid item xs={1}></Grid>
                    <Grid item xs={12} style={{ textAlign: "center" }} >
                        --------------------------------------------------------------
                        คนที่เปิด "โดน" ให้เปิดกล่องสุ่มข้างบนด้วย
                        --------------------------------------------------------------
                    </Grid>
                    {this.state.showBox}
                </Grid>
                <bs4.Modal isOpen={this.state.alertOpen}  >
                    <bs4.ModalHeader toggle={this._alertCancel} >
                        {this.state.modalHeader}
                    </bs4.ModalHeader>
                    <bs4.ModalBody>
                        <p style={{ textAlign: "center" }} >{this.state.modalBody}</p>
                    </bs4.ModalBody>
                    <bs4.ModalFooter>
                        <bs4.Button style={{ width: "100px" }} color="danger" onClick={this._alertCancel}>Cancel</bs4.Button>
                    </bs4.ModalFooter>
                </bs4.Modal>
                <audio src="ding" id="myAudio" loop="loop"></audio>
            </div >
        );
    }
}
export default withStyles(styles)(RandomGame);