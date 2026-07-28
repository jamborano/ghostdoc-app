'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function EnterpriseUploadPage() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email'); // opsional, kalau Gumroad kasih

  const [email, setEmail] = useState(emailParam || '');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !file) {
      setStatus('error');
      setMessage('Please fill in email and select a .zip file.');
      return;
    }

    setLoading(true);
    setStatus('uploading');
    setMessage('Uploading...');

    const formData = new FormData();
    formData.append('email', email);
    formData.append('file', file);

    try {
      const res = await fetch('https://jamboronaodon--ghostdoc-engine-upload-enterprise-zip.modal.run', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage('✅ Upload successful! Your docs will be sent to your email in ~4 minutes.');
      } else {
        setStatus('error');
        setMessage(`❌ Upload failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      setStatus('error');
      setMessage('❌ Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0d1117] text-[#e6edf3] font-sans">
      <Header />
      <div className="max-w-xl mx-auto px-6 pt-32 pb-24">
        <h1 className="text-3xl font-black mb-2 text-center">Enterprise Vault Upload</h1>
        <p className="text-neutral-400 text-center mb-8">Upload your codebase (.zip) — zero‑retention, NDA compliant.</p>

        <form onSubmit={handleSubmit} className="space-y-6 bg-[#161b22] p-8 rounded-2xl border border-[#30363d]">
          <div>
            <label className="block text-sm font-medium mb-1">Delivery Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-3 text-[#e6edf3] focus:outline-none focus:border-[#0366d6]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Codebase Archive (.zip)</label>
            <input
              type="file"
              accept=".zip"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-3 text-[#e6edf3] file:bg-[#30363d] file:border-none file:text-white file:px-4 file:py-2 file:rounded file:cursor-pointer"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0366d6] hover:bg-[#0355b4] text-white font-bold text-sm rounded-full transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Initialize Engine'}
          </button>
        </form>

        {status !== 'idle' && (
          <div className={`mt-4 p-4 rounded-xl border ${
            status === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
            status === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
            'bg-blue-500/10 border-blue-500/30 text-blue-400'
          }`}>
            {message}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}