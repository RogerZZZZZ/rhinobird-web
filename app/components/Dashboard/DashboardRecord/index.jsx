const React = require("react");
const Member = require('../../Member');

require('./style.less');

const UserStore = require('../../../stores/UserStore');
export default React.createClass({
	render: function() {
        let member = UserStore.getUser(this.props.creator);
		return <div className='dashboard-record'>
			<div className='avatar'><Member.Avatar scale={1.5} member={member}/></div>
            <div className='text'>
                <Member.Name member={member}/><span className="time mui-font-style-caption">19:30</span>
                <div>{this.props.content}</div>
            </div>
		</div>;
	}
});
