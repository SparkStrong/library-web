import ClassifySelect from './components/classifySelect/classifySelect.component'
import ResourcesTable from '../components/resourcesTable/resourcesTable.component'
import CatalogueTree from '../components/catalogueTree/catalogueTree.component'
import {browserHistory} from 'react-router'
import networkAction from '../utils/networkAction'
import "./classifyBrowse.style.less"
import React, {Component} from "react"

export default class ClassifyBrowse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subjects: [],
            resources: [],
            objects: [],
            tableData: [],
            objectId: null,
            subjectId: null,
            resTypeId: null,
            sort: "downloads",
            pageInfo: {
                curPage: 1,
                totalPages: 1
            }
        };
    //this.handleClick = this.handleClick.bind(this);
    }
    componentWillMount() {
        const result = networkAction.promiseNetwork({url: `TeachingResourceManagement/teachingResource/classfiedBrowsingAll`, method: 'POST'})
        result.then((res) => {
            // console.log("classfiedBrowsingAll: ", res)
            this.setState({
                subjects: res.data.subjectInfo,
                resources: res.data.resourceType,
                objects: res.data.applicableObject,
            })
        })
    }
    searchNetwork() {
        let {sort, objectId, subjectId, resTypeId} = this.state;
        let page = this.state.pageInfo.curPage;
        // console.info("page: ", page)
        const result = networkAction.promiseNetwork({
            url: `TeachingResourceManagement/teachingResource/classified`,
            method: 'POST'
        }, {
            sort: sort,
            page: page,
            applicableObjectId: objectId,
            subjectId: subjectId,
            resourceTypeId: resTypeId
        })
        result.then((res) => {
            // console.log("classifyBrowsing: ", res)
            let newPageInfo = {
                curPage: res.data.currentPageNo,
                totalPages: res.data.totalPage
            }
            this.setState({
                tableData: res.data.resourceList,
                pageInfo: newPageInfo
            })
        })
    }
    
    handleSortChange(event) {
        let {objectId, subjectId, resourceId, pageInfo} = this.state;
        this.setState({
            sort: event.target.value
        }, this.searchNetwork.bind(this));
    }
    classifySelectSubmit(subjectId, objectId, resTypeId) {
        this.setState({
            subjectId: subjectId,
            objectId: objectId,
            resTypeId: resTypeId,
        }, this.searchNetwork.bind(this));
    }
    handlePageChange(page) {
        this.setState({
            pageInfo: Object.assign({}, this.state.pageInfo, {curPage: page})
        }, this.searchNetwork.bind(this))
    }
    render() {
        let {tableData, selectedDepartment, subjects, resources, objects, pageInfo} = this.state;
        console.log("subjects: ", tableData)
        return (
        <div className="col-sm-12">
            <div className="col-sm-3">
                <ClassifySelect 
                    subjects={subjects} 
                    resources={resources} 
                    objects={objects} 
                    submitFunc={this.classifySelectSubmit.bind(this)}
                    />
            </div>
            <div className="col-sm-9 right-area">
                <div>
                    排序方式：
                    <select value={this.state.sort} onChange={this.handleSortChange.bind(this)}>
                        <option value="downloads">下载量</option>
                        <option value="score">评分</option>
                        <option value="time">上传时间</option>
                    </select>
                </div>
                <ResourcesTable data={tableData} pageInfo={pageInfo} handlePageChange={this.handlePageChange.bind(this)}/>
            </div>
        </div> 
        );
    }
}
