var React = require("react");
const Flex = require('../Flex');
const Ps = require('perfect-scrollbar');

module.exports = React.createClass({
    componentDidMount() {
        Ps.initialize(this.refs.container.getDOMNode());
    },
    componentDidUpdate(){
        Ps.update(this.refs.container.getDOMNode());
    },
    componentWillUnmount(){
        Ps.destroy(this.refs.container.getDOMNode());
    },
    render: function() {
        let style = {position:'relative'};
        if(this.props.fit){
            style = {position:'absolute', top:0, bottom:0, left:0, right:0};
        }
        return <div ref='container' style={style} {...this.props}>
            {this.props.children}
            </div>;
    }
});