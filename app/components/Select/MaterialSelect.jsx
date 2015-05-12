const React       = require('react'),
      MUI         = require('material-ui'),
      Paper       = MUI.Paper,
      TextField   = MUI.TextField,
      MaterialPopup = require('./MaterialPopup'),
      ClickAwayable = MUI.Mixins.ClickAwayable;

require('./style.less');

export default React.createClass({
    mixins: [ClickAwayable, React.addons.LinkedStateMixin],

    propTypes: {
        valueLink: React.PropTypes.shape({
            value: React.PropTypes.array.isRequired,
            requestChange: React.PropTypes.func.isRequired
        }),
        multiple: React.PropTypes.bool,
        indexAttr: React.PropTypes.string,
        placeholder: React.PropTypes.string
    },

    focused: false,

    layoutUpdated: false,

    componentClickAway() {
        this.refs.popupSelect.dismiss();
    },

    componentDidMount() {
        this._updateLayout(this.focused);
    },

    componentDidUpdate() {
        if (!this.layoutUpdated) {
            this.layoutUpdated = true;
            this._updateLayout(this.focused);
        } else {
            this.layoutUpdated = false;
        }
    },

    getDefaultProps() {
        return {
            indexAttr: "index"
        }
    },

    getInitialState() {
        return {
            selected: [],
            children: []
        };
    },

    getValueLink(props) {
        console.log(props.onChange);
        return props.valueLink || {
                value: props.value,
                requestChange: props.onChange
            };
    },

    _delete(index) {
        let selected = this.state.selected;
        if (index < 0 || index >= selected.length) {
            return;
        }
        selected.splice(index, 1);
        this._updateLayout(false, selected);
        this.setState({selected: selected});
        if (this.props.valueLink || this.props.value) {
            this.getValueLink(this.props).requestChange(selected);
        }
    },

    _updateLayout: function(focused) {
        this.focused = focused;
        let selected = this.state.selected;
        let marginTop = 0;
        let paddingLeft = 0;
        let tokenWrapper = this.refs.tokenWrapper;
        let containerWidth = this.getDOMNode().clientWidth;
        if (tokenWrapper) {
            let lastToken = this.refs["token-" + (tokenWrapper.props.children.length - 1)];
            paddingLeft = lastToken.getDOMNode().offsetLeft + lastToken.getDOMNode().clientWidth + 4;
            marginTop = lastToken.getDOMNode().offsetTop;
            if (containerWidth - paddingLeft < 100 && focused) {
                paddingLeft = 0;
                marginTop = tokenWrapper.getDOMNode().clientHeight;
            }
            this.refs.text.getDOMNode().style.marginTop = marginTop + "px";
        }
        this.setState({paddingLeft: paddingLeft});
    },

    _addSelectedOption(value) {
        let selected = this.state.selected;
        if (selected.length === 0) {
            selected.push(value);
        } else {
            if (!this.props.multiple) {
                selected[0] = value;
            } else if (selected.indexOf(value) < 0) {
                selected.push(value);
            } else {
                return ;
            }
        }
        this.setState({selected: selected});
        this._updateLayout(true, selected);
        if (this.props.valueLink || this.props.onChange) {
            console.log(selected);
            this.getValueLink(this.props).requestChange(selected);
        }
    },

    _filter() {
        let keyword = this.refs.text.getValue();
        let children = this.props.children.filter((child) => {
            if (keyword.length === 0 || !child.props.index) return true;
            return child.props.index.indexOf(keyword) >= 0;
        });
        if (children.length >= 0 && !this.refs.popupSelect.isShow()) {
            this.refs.popupSelect.show();
        }
        this.setState({children: children});
    },

    render() {
        let multiple = this.props.multiple || false;
        let styles = {
            select: {
                position: "relative",
                display: "inline-block",
                cursor: "text",
                width: 256
            },
            hint: {
                color: "#999"
            },
            token: {
                float: multiple ? "left" : "none",
                marginRight: 4,
                marginBottom: 4,
                cursor: "pointer",
                padding: "2px 8px",
                display: "block"
            },
            tokenDelete: {
                color: "#777",
                marginLeft: 4,
                float: "right",
                fontWeight: "bold"
            },
            tokenWrapper: {
                position: "absolute",
                cursor: "text",
                zIndex: 2,
                top: 10,
                left: 0,
                right: 0
            },
            padding: {
                paddingLeft: this.state.paddingLeft || 0
            }
        };

        let tokens = [];
        let text =
            <TextField
                ref="text"
                type="text"
                style={styles.padding}
                className={this.props.className}
                onChange={this._filter}
                onFocus={() => this.refs.popupSelect.show()} />;

        let popupSelect =
            <MaterialPopup
                ref="popupSelect"
                style={{position: "absolute", top: "100%", left: 0, right: 0}}
                onItemSelect={(value) => {
                        this._addSelectedOption(value);
                        this.refs.text.setValue("");
                        this._filter();
                        this.refs.popupSelect.dismiss();
                    }
                }
            >
            {this.state.children}
        </MaterialPopup>;

        for (let i = 0; i < this.state.selected.length; i++) {
            tokens.push(
                <Paper key={"token_" + i} ref={"token-" + i} zDepth={1} style={styles.token}>
                    <a onClick={(e) => e.stopPropagation()}>{this.state.selected[i]}</a>
                    <span style={styles.tokenDelete} onClick={(e) => {
                        this._delete(i);
                        e.stopPropagation();
                    }}>x</span>
                </Paper>
            );
        }

        let tokenWrapperDOM =
            tokens.length > 0 ?
                <div ref="tokenWrapper" style={styles.tokenWrapper}
                     onClick={() => {
                        this.refs.text.focus();
                    }}>
                    {tokens}
                </div> : null;

        return (
            <div style={styles.select} >
                {tokenWrapperDOM}
                {text}
                {popupSelect}
            </div>
        );
    }
});