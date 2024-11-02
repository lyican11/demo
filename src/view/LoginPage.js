import React, { useState } from 'react'
import { Form, Input, Button, message, Card } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  //登陆页面获得的response较难传递至其他页面，可以考虑后端使用token或从登陆页面通过url传递用户id到其他页面再对需要使用的信息进行查询
  const mockLogin = async (values) => {
    setLoading(true)
    return new Promise((resolve) => {
      setTimeout(() => {
        const { username, password } = values
        if (username === 'admin' && password === 'password') {
          resolve({
            code: 200,
            course: { id: '1', name: 'Sample Course' },
            identity: '1234',
            userid: '5678',
            name: 'Admin User',
          })
        } else {
          resolve({
            code: 400,
            reason: 'Invalid username or password',
          })
        }
      }, 1000)
    })
  }

  const onFinish = async (values) => {
    const response = await mockLogin(values)
    setLoading(false)
    if (response.code === 200) {
      message.success('Login successful!')
      navigate('/home')
      console.log('User info:', response)
    } else {
      message.error(response.reason)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card title="Login" style={{ width: 300 }}>
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default LoginPage
