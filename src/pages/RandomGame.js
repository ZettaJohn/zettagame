import React, { Component } from 'react';
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/FastForward';

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
class RandomGame extends Component {
    constructor(props) {
        super(props)
        this.state = {
            boxSpecial: [],
            dataBox: testBox,
            showBox: [],
            label_qty: 0,
            label_danger: 0,
            con_01: "",
            con_02: "",
            con_03: "",
            con_04: "",
            con_05: "",
        }
    }
    componentDidMount() {
        // $(".inputForm").hide()
        $(".gameForm").hide()
        // this._setBoxContent(this)
    }
    _selectedBox(self, box_id) {
        var data_box = self.state.dataBox
        var new_box=[]
        var selected_box = []
        console.log("_selectedBox", box_id, data_box)
        var getBoxName = data_box[box_id].box_name
        var getIndex = self._getIndexArray(box_id, data_box, "box_id")
        selected_box.push(
            <Grid item xs={2} >
                <Paper className="boxContent"  >
                    <Paper className="labelContent" >
                        <div className="img-logo-zettaEdit" ></div>
                    </Paper>
                </Paper>
            </Grid>
        )
        data_box.splice(getIndex, 1, selected_box)
        // alert(getBoxName)
        self.setState({ showBox: data_box })
    }
    async _setBoxContent(self) {
        var labelQty = self.state.label_qty
        var data_con = self.state.dataCon
        var arr_box = [], arr_data = []
        for (var i = 0; i < labelQty; i++) {
            arr_box.push(
                <Grid item xs={2} >
                    <Paper className="boxContent"  >
                        <Paper className="labelContent" >
                            <div className="first-label" id={i} onClick={(e) => this._selectedBox(self, e.target.id)} >{'Seminar ' + getYear}</div>
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
                box_name: box_name
            })

        }
        self.setState({
            showBox: arr_box,
            dataBox: arr_data
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
        // console.log("object", labelDanger)
        if (checkLabelQty && checkLabelDanger) {
            var arr_set = this._randomCondition(this, labelQty, labelDanger)
            this.setState({
                dataCon: arr_set
            }, () => {
                this._setBoxContent(this)
            })
            $(".inputForm").hide("slow")
            $(".gameForm").show("slow")
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
            if (arr[i][prop] === val) {
                return i
            }
        }
        return -1
    }
    render() {
        const { classes } = this.props;
        return (
            <div className="bg-default" >
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <Typography variant="h6" color="inherit">
                            <div className="img-logo-zetta" ></div>
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Grid className="inputForm" container direction="row" justify="center" alignItems="center" spacing={16} >
                    <Grid item style={{ textAlign: "center" }} xs={9}>
                        <Paper style={{ margin: "15px 0px 15px 0px", padding: "15px 15px 15px 15px" }} >
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

                            <Grid item xs={12} style={{ margin: "15px 0px 0px 15px" }}  >
                                <Button variant="contained" size="small" className="btn-start" color="primary" onClick={this._startGame} >
                                    <SaveIcon className="icon-left icon-large" />
                                    Start Game
                                </Button>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid className="gameForm" container spacing={16} >
                    {this.state.showBox}
                </Grid>
            </div >
        );
    }
}
export default RandomGame;