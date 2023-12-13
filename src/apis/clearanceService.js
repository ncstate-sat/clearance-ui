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
    getBulkPersonnel: builder.mutation({
      query: ({ values }) => ({
        url: '/personnel/bulk',
        method: 'POST',
        body: {
          values: values,
        },
      }),
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
      query: ({ assigneeIDs, clearanceIDs, startTime }) => ({
        url: '/assignments/assign',
        method: 'POST',
        body: {
          assignees: assigneeIDs,
          clearance_ids: clearanceIDs,
          start_time: startTime,
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
    getReportsByUser: builder.query({
      query: () => ({
        url: '/reports/usage/monthly-by-user',
        method: 'GET',
        responseHandler: (response) => response.text(),
      }),
      transformErrorResponse: (response) => {
        return response?.data?.detail
      },
    }),
    getReportsByDoors: builder.query({
      query: ({
        clearance_id,
        doors_page_size,
        doors_page,
        clearances_limit,
        clearances_skip,
      }) => ({
        url: `/reports/clearances/doors`,
        method: 'GET',
        params: {
          clearance_id,
          doors_page_size,
          doors_page,
          clearances_limit,
          clearances_skip,
        },
      }),
      transformErrorResponse: (response) => {
        return response?.data?.detail
      },
    }),
    getReportsByPersons: builder.query({
      query: ({
        assignee_name,
        clearance_id,
        assignees_page_size,
        assignees_page,
        clearances_limit,
        clearances_skip,
      }) => ({
        url: '/reports/clearances/persons',
        method: 'GET',
        params: {
          assignee_name,
          clearance_id,
          assignees_page_size,
          assignees_page,
          clearances_limit,
          clearances_skip,
        },
      }),
      transformErrorResponse: (response) => {
        return response?.data?.detail
      },
    }),
    getReportsByTransactions: builder.query({
      query: ({ skip, limit, from_time, to_time, assignee_name }) => ({
        url: '/reports/usage/transactions',
        method: 'GET',
        params: {
          skip,
          limit,
          from_time,
          to_time,
          assignee_name,
        },
      }),
      transformErrorResponse: (response) => {
        return response?.data?.detail
      },
    }),
    postHelpTicket: builder.mutation({
      query: ({ subject, body }) => ({
        url: '/help/create-ticket',
        method: 'POST',
        body: {
          subject,
          body,
        },
      }),
      transformErrorResponse: (response) => {
        return response?.data?.detail
      },
    }),
  }),
})

export default api
