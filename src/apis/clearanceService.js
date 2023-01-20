import { createApi } from '@reduxjs/toolkit/query/react'
import baseQuery from './baseQuery'

const api = createApi({
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getClearances: builder.query({
      query: ({ search }) => ({
        url: '/clearances',
        method: 'GET',
        params: {
          search: search,
        },
      }),
      transformResponse: (response, meta, args) => {
        return response['clearance_names']
      },
    }),
    getPersonnel: builder.query({
      query: ({ search }) => ({
        url: '/personnel',
        method: 'GET',
        params: {
          search: search,
        },
      }),
      transformResponse: (response) => {
        return response['personnel']
      },
    }),
    getAssignments: builder.query({
      query: ({ campusId }) => ({
        url: `/assignments/${campusId}`,
        method: 'GET',
      }),
    }),
    assignClearances: builder.mutation({
      query: ({ assigneeIDs, clearanceIDs }) => ({
        url: '/assignments/assign',
        method: 'POST',
        body: {
          assignees: assigneeIDs,
          clearance_ids: clearanceIDs,
        },
      }),
    }),
    revokeClearances: builder.mutation({
      query: ({ assigneeIDs, clearanceIDs }) => ({
        url: '/assignments/revoke',
        method: 'POST',
        body: {
          assignees: assigneeIDs,
          clearance_ids: clearanceIDs,
        },
      }),
    }),
    getAuditLog: builder.query({
      query: ({ params }) => ({
        url: '/audit',
        method: 'GET',
        params: params,
      }),
    }),
    getLiaisonPermissions: builder.query({
      query: ({ campusId }) => ({
        url: '/liaison',
        method: 'GET',
        params: {
          campus_id: campusId,
        },
      }),
    }),
    assignLiaisonPermission: builder.mutation({
      query: ({ campusId, clearanceIDs }) => ({
        url: '/liaison/assign',
        method: 'POST',
        body: {
          campus_id: campusId,
          clearance_ids: clearanceIDs,
        },
      }),
    }),
    revokeLiaisonPermission: builder.mutation({
      query: ({ campusId, clearanceIDs }) => ({
        url: '/liaison/revoke',
        method: 'POST',
        body: {
          campus_id: campusId,
          clearance_ids: clearanceIDs,
        },
      }),
    }),
  }),
})

export default api
