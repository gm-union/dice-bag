import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import { getErrorMessage } from '../lib/form'
import Field from '../components/field'

const SignUpMutation = gql`
  mutation SignUpMutation($email: String!, $password: String!) {
    signUp(input: { email: $email, password: $password }) {
      user {
        id
        email
      }
    }
  }
`

function SignUp() {
  const [signUp] = useMutation(SignUpMutation)
  const [errorMsg, setErrorMsg] = useState()
  const router = useRouter()

  async function handleSubmit(event) {
    event.preventDefault()
    const emailElement = event.currentTarget.elements.email
    const passwordElement = event.currentTarget.elements.password

    try {
      await signUp({
        variables: {
          email: emailElement.value,
          password: passwordElement.value,
        },
      })

      router.push('/signin')
    } catch (error) {
      setErrorMsg(getErrorMessage(error))
    }
  }

  return (
    <>
      <div id="npcApp">
        <div>
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            {errorMsg && <p>{errorMsg}</p>}
            <Field
              name="email"
              type="email"
              autoComplete="email"
              required
              label="Email"
            />
            <Field
              name="password"
              type="password"
              autoComplete="password"
              required
              label="Password"
            />
            <button type="submit">Sign up</button> or{' '}
            <Link href="signin">
              <a>Sign in</a>
            </Link>
          </form>
        </div>
      </div>
      <div />
      <div />
    </>
  )
}

export default SignUp
