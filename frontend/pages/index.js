import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-screen text-center py-4">
        <h1 className="text-4xl my-4 font-bold">
          Meet Retro - the future of public goods funding
        </h1>

        <Link href="/rounds">
          <a className="bg-gradient-to-r from-purple-600 to-blue-800 text-white p-4 rounded-2xl mt-4 font-large my-6">Launch app</a>
        </Link>

        <footer className="text-center border-t p-8">
          <p>
            Made with {String.fromCodePoint('0x2764')} by the Oxford Team
          </p>
        </footer>

      </main>
    </div>
  )
}