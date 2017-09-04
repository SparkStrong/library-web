import React, {Component} from "react"
import { Select } from "antd"
import SelectTree from "../../../components/selectTree/selectTree.component"

const Option = Select.Option

export default class ClassifySelect extends React.Component {  //export关键字定义的函数或类才可以在别的地方通过import引用；加了default之后在import这个函数或类时不需要加大括号，不加则需要加大括号。
    constructor(props) {
        super(props);      //在constructor中不加会报错
        this.state = {
            subjectId: "",
            objectId: "",
            resTypeId: ""
        }
    }
    componentWillReceiveProps(nextProps) {    //接收上一级的参数，当上一级参数改变时执行该函数，接收的参数放在nextProps中
        this.setState({
            subjectId: this.state.subjectId || nextProps.subjects[0].subjectId,    //this.state.subjectId有值的话就取this.state.subjectId的值，没有值就取nextProps.subjects[0].subjectId的值
            objectId: this.state.objectId || nextProps.objects[0].appobjId,
            resTypeId: this.state.resTypeId || nextProps.resources[0].restypeId,
        })
    }
    submitSelect() {
        let {subjectId, objectId, resTypeId} = this.state        
        this.props.submitFunc(subjectId, objectId, resTypeId);
    }
    subjectChange(value) {
        this.setState({
            subjectId: value
        }, this.submitSelect.bind(this))
    }
    objectChange(value) {
        this.setState({
            objectId: value
        }, this.submitSelect.bind(this))
    }
    resTypeChange(value) {
        this.setState({
            resTypeId: value
        }, this.submitSelect.bind(this))
    }
    
    render() {
        let {subjects, objects, resources, submitFunc} = this.props  //从上一级传过来的数据中获取参数值
        let {subjectId, objectId, resTypeId} = this.state
        console.log("objectId: ", objectId, " resTypeId: ", resTypeId, " subjectId: ", subjectId);
        return (
        <div className="well">
            <div className="">
                设备类别：
                <SelectTree 
                    size="large"
                    width={'100%'}
                    placeholder="请选择设备类别"
                    data={subjects}
                    needTop={false}
                    onChange={this.subjectChange.bind(this)}
                    value={subjectId}
                    />
            </div>
            <br />
            <div className="">
                适用对象：
                <Select 
                    size="large"
                    style={{width: '100%'}}
                    value={objectId}
                    placeholder="请选择适用对象"
                    onChange={this.objectChange.bind(this)}>
                    {objects.map((object) => {
                        return (
                            <Option value={object.appobjId} key={object.appobjId}>{object.appobjName}</Option>
                        )
                    })}
                </Select>
            </div>
            <br />
            <div className="">
                资源类型：
                <SelectTree 
                    size="large"
                    width={'100%'}                    
                    placeholder="请选择资源类型"
                    data={resources}
                    needTop={false}
                    onChange={this.resTypeChange.bind(this)}
                    value={resTypeId}
                    />
            </div>
        </div> 
        );
    }
}

ClassifySelect.propTypes = {    //这里规定该组件需要上一级传递的参数
    subjects: React.PropTypes.array.isRequired,  //学科
    resources: React.PropTypes.array.isRequired, //资源类型
    objects: React.PropTypes.array.isRequired,   //适用对象
    submitFunc: React.PropTypes.func.isRequired,  //提交函数
}
ClassifySelect.defaultProps = {    //上一级没有传参数时的默认值
    subjects: [],
    resources: [],
    objects: [],
    submitFunc: () => {}
}