import "./Loading.css"
import { Spin } from 'antd';

function Loading(){
    return (
        <div className="loading-container">
            <Spin size="large"/>
            <h4>Loading...</h4>
        </div>
    )
}
export default Loading