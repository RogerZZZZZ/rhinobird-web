const React           = require("react"),
      MUI             = require('material-ui'),
      Moment          = require("moment"),
      Flex            = require("../../Flex"),
      Link            = require("react-router").Link,
      Selector        = require("../../Select").Selector,
      CalendarActions = require("../../../actions/CalendarActions");

require("./style.less");

// Return the number of week days of a month
// Eg: 2015/2/1 is the first sunday of February, it will return 1.
Date.prototype.weekOfMonth = function() {
    var date = this.getDate();
    var result = 1;
    while (date - 7 >= 0) {
        result++;
        date -= 7;
    }
    return result;
};

export default React.createClass({
    mixins: [React.addons.LinkedStateMixin],

    repeatedEvery: {
        "Daily": "days",
        "Weekly": "weeks",
        "Monthly": "months",
        "Yearly": "years"
    },

    months: ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'],

    daysInWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

    daysInWeekMap: {
        'Sun': 'Sunday',
        'Mon': 'Monday',
        'Tue': 'Tuesday',
        'Wed': 'Wednesday',
        'Thu': 'Thursday',
        'Fri': 'Friday',
        'Sat': 'Saturday'
    },

    errorMsg: {
        titleRequired: "Event title is required.",
        descriptionRequired: "Event description is required."
    },

    componentDidMount() {
        this.refs.eventTitle.focus();
    },

    getInitialState() {
        return {
            title: "",
            titleError: "",
            description: "",
            fullDay: false,
            fromTime: new Date(),
            toTime: new Date(),
            editRepeated: false,
            repeated: false,
            repeatedType: "Daily",
            repeatedFrequency: 1,
            repeatedOn: this._getInitialRepeatedOn(new Date()),
            repeatedBy: "Month",
            repeatedEndType: "Never",
            repeatedEndDate: "",
            repeatedTimes: 1,
            summary: ""
        };
    },

    render() {
        let styles = {
            repeated: {
                overflow: "hidden",
                transition: "all 500ms",
                opacity: this.state.editRepeated ? 1 : 0,
                width: this.state.editRepeated ? "552px" : "0",
                height: "100%"
            }
        };
        return (
            <Flex.Layout horizontal centerJustified wrap>
                <form onSubmit={this._handleSubmit}>
                <MUI.Paper zDepth={3} className="cal-create-event">
                    <div style={{padding: 20}}>
                        <h3>Create Event</h3>

                        <MUI.TextField
                            ref="eventTitle"
                            hintText="Event Title"
                            errorText={this.state.titleError}
                            floatingLabelText="Event Title"
                            valueLink={this.linkState("title")}
                            className="cal-create-event-textfield" />

                        <MUI.TextField
                            multiLine={true}
                            ref="eventDescription"
                            hintText="Description"
                            errorText={this.state.descriptionError}
                            floatingLabelText="Description"
                            className="cal-create-event-textfield"
                            valueLink={this.linkState("description")} />

                        <MUI.Toggle
                            label="Full Day" />

                        <MUI.Tabs className="cal-create-event-tab">
                            <MUI.Tab label="Period" >
                                <div className="tab-template-container">
                                    <Flex.Layout horizontal justified>
                                        <MUI.DatePicker hintText="From Date" />
                                        <MUI.DatePicker hintText="To Date" />
                                    </Flex.Layout>
                                </div>
                            </MUI.Tab>
                            <MUI.Tab label="Point" >
                                <div className="tab-template-container">
                                    <Flex.Layout horizontal justified>
                                        <MUI.DatePicker hintText="From Date" />
                                        <MUI.DatePicker hintText="To Date" />
                                    </Flex.Layout>
                                </div>
                            </MUI.Tab>
                        </MUI.Tabs>

                        <MUI.Toggle
                            ref="repeated"
                            label="Repeated"
                            onToggle={this._onRepeatToggled} />

                        <MUI.TextField
                            ref="eventParticipant"
                            hintText="Participants"
                            floatingLabelText="Participants"
                            className="cal-create-event-textfield" />

                        <br/>

                        <Flex.Layout horizontal justified>
                            <Link to="event-list">
                                <MUI.RaisedButton label="Cancel" />
                            </Link>
                            <MUI.RaisedButton label="Create Event" primary={true} />
                        </Flex.Layout>

                    </div>
                </MUI.Paper>
                </form>
                <MUI.Paper zDepth={2} style={styles.repeated} className="cal-create-event">
                    <div style={{padding: 20}}>
                        <Flex.Layout horizontal>
                            <h3>Repeat Infomation</h3>
                        </Flex.Layout>
                        {this._getRepeatedInfoContent()}
                    </div>
                </MUI.Paper>
            </Flex.Layout>
        );
    },

    _handleSubmit(e) {
        e.preventDefault();
        let errorMsg = this.errorMsg;

        if (this.state.title.length === 0) {
            this.setState({titleError: errorMsg.titleRequired});
            return;
        } else {
            this.setState({titleError: ""});
        }

        if (this.state.description.length === 0) {
            this.setState({descriptionError: errorMsg.descriptionRequired});
            return;
        } else {
            this.setState({descriptionError: ""});
        }

        CalendarActions.create(this.state, () => window.location.href = "/platform/calendar");
    },

    _getRepeatedInfoContent() {
        let styles = {
            textfield: {
                textAlign: "center",
                fontSize: "0.9em"
            },
            row: {
                lineHeight: "3em"
            },
            endDate: {
                width: "50px"
            }
        };

        let weeklyRepeatOn =
            <Flex.Layout horizontal justified hidden={this.state.repeatedType !== "Weekly"} style={styles.row}>
                <label>Repeated On:</label>
                <Selector
                    multiple
                    valueLink={this.linkState("repeatedOn")}
                    onSelectChange={this._repeatedOnChange}>
                    <span className="cal-event-repeated-item" name="Sun">Sun</span>
                    <span className="cal-event-repeated-item" name="Mon">Mon</span>
                    <span className="cal-event-repeated-item" name="Tue">Tue</span>
                    <span className="cal-event-repeated-item" name="Wed">Wed</span>
                    <span className="cal-event-repeated-item" name="Thu">Thu</span>
                    <span className="cal-event-repeated-item" name="Fri">Fri</span>
                    <span className="cal-event-repeated-item" name="Sat">Sat</span>
                </Selector>
            </Flex.Layout>;

        let monthlyRepeatBy =
            <Flex.Layout horizontal justified hidden={this.state.repeatedType !== "Monthly"} style={styles.row}>
                <label>Repeated By:</label>
                <Selector
                    valueLink={this.linkState("repeatedBy")}>
                    <span className="cal-event-repeated-item" name="Month">Month</span>
                    <span className="cal-event-repeated-item" name="Week">Week</span>
                </Selector>
            </Flex.Layout>;

        let occurrence =
            <Flex.Layout horizontal selfEnd hidden={this.state.repeatedEndType !== "Occurrence"}>
                <Flex.Layout vertical selfCenter>
                    <label>After</label>
                </Flex.Layout>
                <MUI.TextField
                    type="text"
                    ref="repeatedTimes"
                    styles={styles.textfield}
                    className="cal-event-repeated-every"
                    valueLink={this.linkState("repeatedTimes")}/>
                <Flex.Layout vertical selfCenter>
                    <label>times</label>
                </Flex.Layout>
            </Flex.Layout>;

        let endDate =
            <Flex.Layout horizontal selfEnd hidden={this.state.repeatedEndType !== "Date"}>
                <Flex.Layout vertical selfCenter>
                    <label>Ends On:</label>
                </Flex.Layout>
                <Flex.Layout vertical selfCenter>
                    <MUI.DatePicker
                        ref="repeatedEndDate"
                        defaultDate={this.state.fromTime}
                        hintText="" mode="landscape"
                        className="cal-event-repeated-end-date" />
                </Flex.Layout>
            </Flex.Layout>;

        return (
            <Flex.Layout vertical>
                <Flex.Layout horizontal justified style={styles.row}>
                    <label>Repeats:</label>
                    <Selector
                        valueLink={this.linkState("repeatedType")}
                        onSelectChange={this._repeatedTypeChange}>
                        <span className="cal-event-repeated-item" name="Daily">Daily</span>
                        <span className="cal-event-repeated-item" name="Weekly">Weekly</span>
                        <span className="cal-event-repeated-item" name="Monthly">Monthly</span>
                        <span className="cal-event-repeated-item" name="Yearly">Yearly</span>
                    </Selector>
                </Flex.Layout>

                <Flex.Layout horizontal justified style={styles.row}>
                    <Flex.Layout vertical selfCenter>
                        <label>Repeated Every:</label>
                    </Flex.Layout>
                    <div>
                        <MUI.TextField
                            type="text"
                            ref="repeatedFrequency"
                            styles={styles.textfield}
                            className="cal-event-repeated-every"
                            valueLink={this.linkState("repeatedFrequency")} />
                        {this.repeatedEvery[this.state.repeatedType]}
                    </div>
                </Flex.Layout>

                {weeklyRepeatOn}

                {monthlyRepeatBy}

                <Flex.Layout horizontal justified style={styles.row}>
                    <label>Ends Way:</label>
                    <Selector
                        ref="repeatedEndType"
                        valueLink={this.linkState("repeatedEndType")}
                        onSelectChange={this._repeatedEndTypeChange}>
                        <span className="cal-event-repeated-item" name="Never">Never</span>
                        <span className="cal-event-repeated-item" name="Occurrence">Occurrence</span>
                        <span className="cal-event-repeated-item" name="Date">Date</span>
                    </Selector>
                </Flex.Layout>

                {occurrence}

                {endDate}

                <Flex.Layout horizonal justified style={styles.row}>
                    <label>Repeat Summary:</label>
                    <label>{this._getSummary()}</label>
                </Flex.Layout>

                <Flex.Layout horizontal justified>
                    <MUI.RaisedButton label="Cancel" onClick={this._cancelRepeatedInfo} />
                    <MUI.RaisedButton label="Confirm" secondary={true} onClick={this._confirmRepeatedInfo} />
                </Flex.Layout>
            </Flex.Layout>
        );
    },

    _cancelRepeatedInfo() {
        this.setState({editRepeated: false});
        this.refs.repeated.setToggled(false);
    },

    _confirmRepeatedInfo() {
        this.setState({editRepeated: false});
        this.refs.repeated.setToggled(true);
    },

    _getInitialRepeatedOn(fromTime) {
        let from = new Date(fromTime);
        let repeatedOn = [];
        repeatedOn.push(this.daysInWeek[from.getDay()]);
        return repeatedOn;
    },

    _getInitialRepeatedEndDate(fromTime) {
        let endDate = new Date(new Date(fromTime).getTime() + 2592000000);
        return Moment(endDate).format("MM/DD/YYYY");
    },

    _repeatedTypeChange() {
        this.refs.repeatedFrequency.focus();
    },

    _repeatedOnChange(selectedValue) {
        if (selectedValue === null || (Array.isArray(selectedValue) && selectedValue.length === 0)) {
            this.setState({repeatedOn: this._getInitialRepeatedOn()});
        }
    },

    _repeatedEndTypeChange(repeatedEndType) {
        if (repeatedEndType === "Occurrence") {
            this.refs.repeatedTimes.focus();
        }
    },

    _getSummary() {
        let repeatedInfo = this.state;

        var summary = "", frequencyOne, frequencyMultiple;
        frequencyOne = repeatedInfo.repeatedType;

        if (repeatedInfo.repeatedType == 'Daily') {
            frequencyMultiple = 'days';
        } else if (repeatedInfo.repeatedType == 'Weekly') {
            frequencyMultiple = 'weeks';
        } else if (repeatedInfo.repeatedType == 'Monthly') {
            frequencyMultiple = 'months'
        } else if (repeatedInfo.repeatedType == 'Yearly') {
            frequencyMultiple = 'years';
        }

        // Repeat event frequency summary
        if (repeatedInfo.repeatedFrequency == 1) {
            summary += frequencyOne;
        } else if (repeatedInfo.repeatedFrequency > 1) {
            summary += ("Every " + repeatedInfo.repeatedFrequency + " " + frequencyMultiple);
        } else {
            summary += frequencyOne;
        }

        var from = new Date(this.state.fromTime);

        // Repeat event days summary
        if (repeatedInfo.repeatedType == 'Weekly') {
            summary += ' on ';
            for (var i = 0; i < repeatedInfo.repeatedOn.length; i++) {
                summary += this.daysInWeekMap[repeatedInfo.repeatedOn[i]];
                if (i != repeatedInfo.repeatedOn.length - 1)
                    summary += ', ';
            }
        } else if (repeatedInfo.repeatedType == 'Monthly') {
            summary += ' on ';
            if (repeatedInfo.repeatedBy == 'Month') {
                summary += ' day ' + from.getDate();
            } else if (repeatedInfo.repeatedBy == 'Week') {
                summary += ' the ';
                var weekOfMonth = from.weekOfMonth();

                if (weekOfMonth == 1) {
                    summary += ' first ';
                } else if (weekOfMonth == 2) {
                    summary += ' second ';
                } else if (weekOfMonth == 3) {
                    summary += ' third ';
                } else if (weekOfMonth == 4) {
                    summary += ' fourth ';
                } else if (weekOfMonth == 5) {
                    summary += ' fifth ';
                }

                summary += this.daysInWeekMap[this.daysInWeek[from.getDay()]];
            }
        } else if (repeatedInfo.repeatedType === 'Yearly') {
            summary += ' on ' + this.months[from.getMonth()] + ' ' + from.getDate();
        }

        // Repeat event ends way summary
        if (repeatedInfo.repeatedEndType == 'Occurrence') {
            if (isNaN(event.repeatedTimes)) repeatedInfo.repeatedTimes = 1;
            else repeatedInfo.repeatedTimes = Math.floor(repeatedInfo.repeatedTimes);

            summary += ", " + repeatedInfo.repeatedTimes + " times";
        } else if (repeatedInfo.repeatedEndType == 'Date') {
            summary += ", until " + this.refs.repeatedEndDate.getDate().toDateString();
        }
        return summary;
    },

    _onRepeatToggled(e, isInputChecked) {
        if (isInputChecked) {
            this.setState({editRepeated: true});
        } else {
            this.setState({editRepeated: false});
        }
    }
});
