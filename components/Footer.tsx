export default function Footer() {
  return (
    <footer className="relative z-10 w-full py-8 text-center text-xs text-neutral-500 bg-[#0c0d12]">
      <div className="max-w-4xl mx-auto">
        <p>
          &copy; {new Date().getFullYear()} GhostDoc —{' '}
          <a
            href="https://jbtech.biz.id"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-[#4d6cf7] hover:underline transition-colors duration-0"
          >
            jbtech.biz.id
          </a>
          . All rights reserved.
        </p>
        <p className="mt-1 text-neutral-600 font-medium tracking-wide">
          Zero Retention. Zero Compromise.
        </p>
        <p className="text-neutral-600 font-medium tracking-wide">
          Enterprise Grade Documentation.
        </p>
      </div>
    </footer>
  );
}