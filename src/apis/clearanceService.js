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
        return {
          clearances: response['clearance_names'],
          length: response['clearance_names'].length,
        }
      },
      transformErrorResponse: (response) => {
        return response?.data?.detail
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
        return {
          personnel: response['personnel'],
          length: response['personnel'].length,
        }
      },
      transformErrorResponse: (response) => {
        return response?.data?.detail
      },
    }),
    getAssignments: builder.query({
      query: ({ campusId }) => ({
        url: `/assignments/${campusId}`,
        method: 'GET',
      }),
      transformErrorResponse: (response) => {
        return response?.data?.detail
      },
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
      transformErrorResponse: (response) => {
        return response?.data?.detail
      },
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
      transformErrorResponse: (response) => {
        return response?.data?.detail
      },
    }),
    getAuditLog: builder.query({
      query: ({ params }) => ({
        url: '/audit',
        method: 'GET',
        params: params,
      }),
      transformErrorResponse: (response) => {
        return response?.data?.detail
      },
    }),
    getLiaisonPermissions: builder.query({
      query: ({ campusId }) => ({
        url: '/liaison',
        method: 'GET',
        params: {
          campus_id: campusId,
        },
      }),
      transformErrorResponse: (response) => {
        return response?.data?.detail
      },
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
      transformErrorResponse: (response) => {
        return response?.data?.detail
      },
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
      transformErrorResponse: (response) => {
        return response?.data?.detail
      },
    }),
  }),
})

export default api
