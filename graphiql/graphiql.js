import React from 'react';
import GraphiQL from 'graphiql';
import axios from 'axios';

import './index.css';
import 'graphiql/graphiql.css';
import snapLogo from './sfusnap.png';

const fetcher = (graphQLParams) => {
  return axios({
    url: '/graphql',
    method: 'POST',
    data: graphQLParams,
  })
    .then((response) => {
      return response.data;
    })
    .catch((response) => {
      return response.data;
    });
};

const query = `# SFU Snap uses GraphQL (http://graphql.org) to query data.
#
# Type queries into this side of the screen, and you will
# see intelligent typeaheads aware of the current GraphQL type schema,
# live syntax, and validation errors highlighted within the text.
#
# Click the "play" button or press Ctrl-Enter to execute your query.
#
# A GraphQL query looks a lot like JSON, with only the values.
# The response mirrors the query form.
#
# We'll get you started with a simple query showing your SFU Computing ID,
# and your first, common (or preferred), and last names.

query {
  viewer {
    username
    firstnames
    commonname
    lastname
  }
}
`;

const CustomGraphiQL = React.createClass({
  getInitialState() {
    return {
      fetcher,
      query,
      variables: '',
      schema: undefined,
      currentUser: {},
    };
  },

  propTypes: {
    jwt: React.PropTypes.string.isRequired,
  },

  componentDidMount() {
    axios({
      url: '/api/v1/users/self',
      method: 'get',
      headers: {
        Authorization: `Bearer ${this.props.jwt}`,
      },
    }).then((response) => {
      const { data } = response;
      this.setState({
        currentUser: data,
        response: JSON.stringify(
          {
            data: {
              viewer: {
                username: data.username,
                firstnames: data.firstnames,
                commonname: data.commonname,
                lastname: data.lastname,
              },
            },
          },
          null,
          2
        ),
      });
    });
  },

  handleLogoutButton(ev) {
    ev.preventDefault();
    window.location = ev.target.href;
  },

  render() {
    const { currentUser } = this.state;
    const name = `${
      currentUser.commonname ? currentUser.commonname : currentUser.firstnames
    } ${currentUser.lastname}`;
    return (
      <GraphiQL {...this.state}>
        <GraphiQL.Logo>
          <a href="/">
            <img alt="SFU Snap" src={snapLogo} height={40} width={40} />
          </a>
        </GraphiQL.Logo>

        <GraphiQL.Toolbar>
          <span style={{ marginLeft: '1em', marginRight: '1em' }}>
            Logged in as{' '}
            <b>
              {name} ({currentUser.username})
            </b>
          </span>
          <a
            className="toolbar-button"
            href="/auth/logout"
            title="Log out of SFU Snap"
            onClick={this.handleLogoutButton}
            onKeyDown={this.handleLogoutButton}
          >
            Logout
          </a>
        </GraphiQL.Toolbar>
      </GraphiQL>
    );
  },
});

export default CustomGraphiQL;
