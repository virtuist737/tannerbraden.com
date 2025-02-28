import Link from 'next/link'; // Assumed import

const Navigation = () => {
  const links = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Blog", href: "/blog" },
    { label: "Loop Machine", href: "/loop-machine" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav>
      <ul>
        {links.map(({ label, href }) => (
          <li key={href}>
            <Link href={href}>
              <a>{label}</a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;


// Assumed page component for /loop-machine
import LoopMachine from '@client/src/components/LoopMachine.tsx'; // Assumed import

const LoopMachinePage = () => {
  return (
    <div>
      <h1>Loop Machine</h1>
      <LoopMachine />
    </div>
  );
};

export default LoopMachinePage;

// Assumed routing configuration (needs to be integrated with your existing setup).
// Example using Next.js
// pages/loop-machine.js would contain the LoopMachinePage component above.