import React, { useState, useRef } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { Upload, Button, Pagination, message, Card, Typography, Tabs, Slider, Modal, Row, Col, Select, InputNumber, Progress, Layout, Menu } from 'antd'
import { UploadOutlined, LeftOutlined, RightOutlined, VideoCameraOutlined, FilePdfOutlined, AppstoreAddOutlined, MenuFoldOutlined, MenuUnfoldOutlined, FileOutlined } from '@ant-design/icons'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import 'antd/dist/reset.css'
import KnowledgeGraph from '../component/KnowledgeGraph'
import { useNavigate } from 'react-router-dom'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cat.net/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`

const { Text, Paragraph } = Typography
const { TabPane } = Tabs
const { Option } = Select
const { Header, Sider, Content } = Layout

const user_info = {
  code: 200,
  courses: [{ id: '1', name: 'Course 1' }, { id: '2', name: 'Course 2' }],
  identity: '123',
  userid: '456',
  name: 'Admin'
}

const GraphData = {
  document_id: "f2405076-35b5-4ef2-bca2-c5627a5c8d10",
  status: 200,
  type: "graph",
  message: "success",
  payload: {
    nodes: [
      {
        id: "0",
        label: "丁奎岭",
        type: "person",
        connections: ["1", "2"],
        card: "message from dingkui",
        detailId: "80313741-3307-4123-ba9c-07897fd7e5fc"
      },
      {
        id: "1",
        label: "Node 1",
        type: "person",
        connections: ["0"],
        card: "Detail about Node 1",
        detailId: "node-1-detail-id"
      },
      {
        id: "2",
        label: "Node 2",
        type: "person",
        connections: ["0"],
        card: "Detail about Node 2",
        detailId: "node-2-detail-id"
      }
    ]
  }
}

const QuestionData = {
  document_id: "f2405076-35b5-4ef2-bca2-c5627a5c8d10",
  status: 200,
  type: "exercise",
  message: "success",
  payload: [
    {
      type: "single-choice",
      question: "丁奎岭是谁？",
      options: ["一个演员", "一个演员", "一个演员", "一个演员"],
      answer: "a"
    },
    {
      type: "multiple-choice",
      question: "丁奎岭是谁？",
      options: ["一个演员", "一个演员", "一个演员", "一个演员"],
      answer: "abcd"
    },
    {
      type: "fill-blank",
      question: ["丁奎岭是", "。"],
      answer: ["一个演员"]
    },
    {
      type: "long-answer",
      question: "丁奎岭是谁？",
      answer: "一个演员"
    }
  ]
}

function HomePage () {
  const [collapsed, setCollapsed] = useState(false)
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [file, setFile] = useState(null)
  const [questions, setQuestions] = useState([])
  const [graphData, setGraphData] = useState(null)
  const [selectedLeftTab, setSelectedLeftTab] = useState('pdf')
  const [selectedRightTab, setSelectedRightTab] = useState('questions')
  const [videoDuration, setVideoDuration] = useState(0)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [range, setRange] = useState([0, 0])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedType, setSelectedType] = useState('single-choice')
  const [selectedQuantity, setSelectedQuantity] = useState(5)
  const [progress, setProgress] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const navigate = useNavigate()
  const videoRef = useRef(null)

  const courseList = user_info.courses.map(course => <Option key={course.id}>{course.name}</Option>)

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  function onDocumentLoadSuccess ({ numPages }) {
    setNumPages(numPages)
  }

  const onFileChange = (info) => {
    const selectedFile = info.file.originFileObj
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile({ type: 'pdf', file: selectedFile })
        setPageNumber(1)
        //message.success('PDF file uploaded successfully.')
      } else if (selectedFile.type.startsWith('video/')) {
        setFile({ type: 'video', file: URL.createObjectURL(selectedFile) })
        //message.success('Video file uploaded successfully.')
      } else {
        message.error('Please upload a valid file.')
      }
    }
  }

  const goToPage = (page) => {
    setPageNumber(page)
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration)
      setRange([0, videoRef.current.duration])
    }
  }

  const openModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    const [startTime, endTime] = range
    if (selectedRightTab === 'questions') {
      setQuestions(QuestionData.payload)
    }
    else {
      setGraphData(GraphData.payload)
    }
    if (startTime >= endTime) {
      message.error('End time must be greater than start time.')
      return
    }
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const onSliderChange = (value) => {
    setRange(value)
  }

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = (timeInSeconds % 60).toFixed(2)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  //模拟生成问题,连接后端需要进行轮询请求
  const generateQuestions = () => {
    if (!file) {
      message.error("Please select a file first")
      return
    }
    if (file.type === 'video') {
      openModal()
      return
    }
    setProgress(0)
    setQuestions([])
    setIsGenerating(true)
    function whatAnswer (type) {
      if (type === "single-choice") {
        return "a"
      }
      else if (type === 'muliple-choice') {
        return "ad"
      }
      else if (type === 'fill-blank') {
        return ["Blank Answer"]
      }
      else {
        return "long answer"
      }
    }
    function whatQuestion (type) {
      if (type === "fill-blank") {
        return ["Fill", "Blank"]
      }
      else {
        return "This is a question"
      }
    }
    function whatOption (type) {
      if (type === "single-choice") {
        return ["Option A", "Option B", "Option C", "Option D"]
      }
      else if (type === 'multiple-choice') {
        return ["Option A", "Option B", "Option C", "Option D"]
      }
      else {
        return null
      }
    }
    const intervalId = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(intervalId)
          setIsGenerating(false)
          // Simulate generated questions based on the selected type and quantity
          const generatedQuestions = Array.from({ length: selectedQuantity }, (_, index) => ({
            id: index + 1,
            type: selectedType,
            question: whatQuestion(selectedType),
            options: whatOption(selectedType),
            answer: whatAnswer(selectedType)
          }))
          setQuestions(generatedQuestions)
          message.success("Questions generated successfully!")
          return 100
        }
        return prevProgress + 10 // Increment progress by 10% at each interval
      })
    }, 300) // Update every 300ms
  }

  const generateGraph = () => {
    if (!file) {
      message.error("Please select a file first")
      return
    }
    if (file.type === 'video') {
      openModal()
      return
    }
    setGraphData(GraphData.payload)
  }

  const renderQuestion = (question, index) => {
    switch (question.type) {
      case 'single-choice':
        return (
          <Card title={`Question ${index + 1} (Single Choice)`} key={index} style={{ marginBottom: "15px" }}>
            <Paragraph>
              <Text strong>{question.question}</Text>
            </Paragraph>
            {question.options.map((option, idx) => (
              <Paragraph key={idx}>
                <Text>{String.fromCharCode(65 + idx)}. {option}</Text>
              </Paragraph>
            ))}
            <Paragraph>
              <Text type="secondary">Answer: {question.answer.toUpperCase()}</Text>
            </Paragraph>
          </Card>
        )
      case 'multiple-choice':
        return (
          <Card title={`Question ${index + 1} (Multiple Choice)`} key={index} style={{ marginBottom: "15px" }}>
            <Paragraph>
              <Text strong>{question.question}</Text>
            </Paragraph>
            {question.options.map((option, idx) => (
              <Paragraph key={idx}>
                <Text>{String.fromCharCode(65 + idx)}. {option}</Text>
              </Paragraph>
            ))}
            <Paragraph>
              <Text type="secondary">Answer: {question.answer.toUpperCase()}</Text>
            </Paragraph>
          </Card>
        )
      case 'fill-blank':
        return (
          <Card title={`Question ${index + 1} (Fill in the Blank)`} key={index} style={{ marginBottom: "15px" }}>
            <Paragraph>
              {question.question.map((part, idx) => (
                <Text key={idx}>
                  {part}
                  {idx < question.answer.length && (
                    <Text underline>{'______'}</Text>
                  )}
                </Text>
              ))}
            </Paragraph>
            <Paragraph>
              <Text type="secondary">Answer: {question.answer.join(', ')}</Text>
            </Paragraph>
          </Card>
        )
      case 'long-answer':
        return (
          <Card title={`Question ${index + 1} (Long Answer)`} key={index} style={{ marginBottom: "15px" }}>
            <Paragraph>
              <Text strong>{question.question}</Text>
            </Paragraph>
            <Paragraph>
              <Text type="secondary">Answer: {question.answer}</Text>
            </Paragraph>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} trigger={null} style={{ background: '#fff' }}>
        <div className="logo" />
        <Menu theme="light" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.SubMenu key="sub1" icon={<FileOutlined />} title="管理文档">
            <Menu.Item key="2">
              <Button
                type="ghost"
                size="small"
                onClick={() => {
                  message.success('增加材料成功')
                }}
              >
                增加材料
              </Button>
            </Menu.Item>
            <Menu.Item key="3">
              <Button
                type="ghost"
                size="small"
                onClick={() => {
                  message.success('删除材料成功')
                }}
              >
                删除材料
              </Button>
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }}>
          <Row style={{ marginBottom: '5px' }}>
            <Col>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={toggleCollapsed}
                style={{
                  fontSize: '16px',
                  width: 64,
                  height: 64,
                }}
              />
            </Col>
            <Col>
              <Select
                placeholder="Select a course"
                style={{ width: '100%', marginBottom: '20px' }}
                onChange={setSelectedCourse}
              >
                {courseList}
              </Select>
            </Col>
            <Col style={{ flex: 1, textAlign: 'right' }}>
              <span>Welcome ! {user_info.name}</span>
              <Button type="link" onClick={() => {
                message.success('Logged out successfully.')
                navigate('/')
              }}>Logout</Button>
            </Col>
          </Row>
        </Header>
        <Content>
          <div style={{ padding: '20px', display: 'flex' }}>
            <Col>
              <Row>
                <Col style={{ flex: 1, marginRight: '20px', width: '1100px' }}>
                  <Tabs defaultActiveKey="pdf" onChange={setSelectedLeftTab} style={{ marginBottom: '20px' }}>
                    <TabPane tab={<span><FilePdfOutlined /> PDF</span>} key="pdf" />
                    <TabPane tab={<span><VideoCameraOutlined /> Video</span>} key="video" />
                  </Tabs>
                  {selectedLeftTab === 'pdf' && (
                    <>
                      <Upload
                        accept="application/pdf"
                        showUploadList={false}
                        onChange={onFileChange}
                        style={{ marginBottom: '20px' }}
                      >
                        <Button icon={<UploadOutlined />}>Click to Upload PDF</Button>
                      </Upload>
                      {file && file.type === 'pdf' && (
                        <>
                          <div style={{ width: '100%', height: '100vh', overflow: 'auto', border: '1px solid #d9d9d9', padding: '10px', marginTop: "20px" }}>
                            <Document
                              file={file.file}
                              onLoadSuccess={onDocumentLoadSuccess}
                            >
                              <Page pageNumber={pageNumber} scale={1.2} />
                            </Document>
                          </div>
                          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Button
                              icon={<LeftOutlined />}
                              onClick={() => goToPage(pageNumber - 1)}
                              disabled={pageNumber <= 1}
                            >
                              Previous
                            </Button>
                            <Pagination
                              simple
                              current={pageNumber}
                              total={numPages}
                              pageSize={1}
                              onChange={goToPage}
                            />
                            <Button
                              icon={<RightOutlined />}
                              onClick={() => goToPage(pageNumber + 1)}
                              disabled={pageNumber >= numPages}
                            >
                              Next
                            </Button>
                          </div>
                        </>
                      )}
                    </>
                  )}
                  {selectedLeftTab === 'video' && (
                    <>
                      <Upload
                        accept="video/*"
                        showUploadList={false}
                        onChange={onFileChange}
                        style={{ marginBottom: '20px' }}
                      >
                        <Button icon={<UploadOutlined />}>Click to Upload Video</Button>
                      </Upload>
                      {file && file.type === 'video' && (
                        <div style={{ width: '100%', height: 'auto', overflow: 'auto', border: '1px solid #d9d9d9', padding: '10px', marginTop: "20px" }}>
                          <video controls style={{ width: '100%' }} ref={videoRef} onLoadedMetadata={handleLoadedMetadata}>
                            <source src={file.file} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}
                    </>
                  )}
                </Col>

                <Col style={{ flex: 1, width: '1100px' }}>
                  <Tabs defaultActiveKey="questions" onChange={setSelectedRightTab} style={{ marginBottom: '20px' }}>
                    <TabPane tab={<span><AppstoreAddOutlined /> Questions</span>} key="questions" />
                    <TabPane tab={<span><AppstoreAddOutlined /> Knowledge Graph</span>} key="graph" />
                  </Tabs>
                  {selectedRightTab === 'questions' && (
                    <>
                      <Select
                        defaultValue="Single Choice"
                        style={{ width: 150, marginRight: '10px' }}
                        onChange={setSelectedType}
                      >
                        <Option value="single-Choice">Single Choice</Option>
                        <Option value="multiple-choice">Multiple Choice</Option>
                        <Option value="fill-blank">Fill Blank</Option>
                        <Option value="long-answer">Long Answer</Option>
                      </Select>
                      <InputNumber
                        defaultValue={5}
                        onChange={(value) => setSelectedQuantity(value)}
                        min={1}
                        max={100}
                        step={1}
                        style={{ width: 120, marginRight: '10px' }}
                      />
                      <Button onClick={generateQuestions} style={{ marginBottom: '20px' }}>
                        Generate Questions
                      </Button>
                      {isGenerating && (
                        <div style={{ marginBottom: '20px', width: 300 }}>
                          <Progress percent={progress} status={progress < 100 ? "active" : "success"} />
                        </div>
                      )}
                      <div>
                        {questions.length > 0 ? (
                          questions.map((question, index) => renderQuestion(question, index))
                        ) : (
                          // <Paragraph>No questions generated yet.</Paragraph>
                          <></>
                        )}
                      </div>
                    </>
                  )}
                  {selectedRightTab === 'graph' && (
                    <>
                      <Button onClick={generateGraph} style={{ marginBottom: '5px' }}>
                        Generate Knowledge Graph
                      </Button>
                      <div>
                        {graphData ? <KnowledgeGraph graphData={graphData} /> : <></>}
                      </div>
                    </>
                  )}
                </Col>
              </Row>
            </Col>
            <Modal title="Select Video Range" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
              <Row>
                <Col span={8}>Start Time: {formatTime(range[0])}</Col>
                <Col span={8} offset={8}>End Time: {formatTime(range[1])}</Col>
              </Row>
              <Slider
                range
                step={0.01}
                min={0}
                max={videoDuration}
                value={range}
                onChange={onSliderChange}
                tooltip={{ formatter: null }}
              />
            </Modal>
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default HomePage
