import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

const ViewerQuery = gql`
  query ViewerQuery {
    viewer {
      id
      email
    }
  }
`

const Index = () => {
  const router = useRouter()
  const { data, loading, error } = useQuery(ViewerQuery)
  const viewer = data?.viewer
  const shouldRedirect = !(loading || error || viewer)

  useEffect(() => {
    if (shouldRedirect) {
      router.push('/signin')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldRedirect])

  if (error) {
    return <p>{error.message}</p>
  }

  if (viewer) {
    return (
      <div>
        <div>
          You're signed in as {viewer.email} goto{' '}
          <Link href="/about">
            <a>about</a>
          </Link>{' '}
              page. or{' '}
          <Link href="/signout">
            <a>signout</a>
          </Link>
        </div>
        <div class="npcApp">
          <div>
            <h2>My saved NPCs</h2>
            <div class="npcListOutput">
              <p>You have no saved NPCs yet</p>
              <a hre="#">&#36;&#123;npc.name	&#125;</a>
            </div>
            <div class="randomBtnHolder">
              <button>
                Roll a random NPC
              </button>
            </div>
          </div>
          <div>
            <div id="npcCardTarget">

              <div class="npcCard">
                <em>(Random Name)</em><br />
                <span>(Random Body Type) (Random Background) (Random Race) (Random Gender)</span><br />
                <span>Influenced by: (Random Influenced By)</span>
              </div>

            </div>
          </div>
          <div>
            <div class="editGrid">
              <input type="hidden" id="selectedNpcGuid" />
              <label><b>Name</b><input type="text" id="editNameField" /></label>
              <label><b>Body Type</b><input type="text" id="editBodyTypeField" /></label>
              <label><b>Background</b><input type="text" id="editBackgroundField" /></label>
              <label><b>Race</b><input type="text" id="editRaceField" /></label>
              <label><b>Gender</b><input type="text" id="editGenderField" /></label>
              <label><b>Influenced By</b><input type="text" id="editInfluencedByField" /></label>
              <div>
                <span></span>
                <div><button>Save</button></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <p>Loading...</p>
}

export default Index
