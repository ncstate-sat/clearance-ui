/* eslint-disable react/no-danger */
import { extractStyles } from 'evergreen-ui'
import Document, { Head, Main, NextScript, Html } from 'next/document'
import React from 'react'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage
    const { css, hydrationScript } = extractStyles()

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        css,
        hydrationScript,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    const { css, hydrationScript } = this.props

    return (
      <Html>
        <Head>
          <link
            href='https://cdn.ncsu.edu/brand-assets/fonts-2-0/include.css'
            rel='stylesheet'
            type='text/css'
          />
          <style dangerouslySetInnerHTML={{ __html: css }} />
          <script
            src='https://accounts.google.com/gsi/client'
            async
            defer
          ></script>
        </Head>

        <body style={{ margin: '0' }}>
          <Main />
          {hydrationScript}
          <NextScript />
        </body>
      </Html>
    )
  }
}
