import React, {useState, useEffect} from 'react'
import { useParams, Link } from 'react-router-dom'
import documentService from '../../services/documentService'
import toast from 'react-hot-toast'
import {ArrowLeft, ExternalLink} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader.jsx'
import Tabs from '../../components/common/Tabs.jsx'
import AIActions from '../../components/ai/AIActions.jsx'
import QuizManager from '../../components/quiz/QuizManager.jsx'
import FlashcardManager from '../../components/flashcards/FlashcardManager.jsx'
import ChatInterface from '../../components/chat/ChatInterface.jsx'

const DocumentDetailPage = () => {

  const {id} = useParams()
  const [document, setDocument] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Content')
  const [pdfUrl, setPdfUrl] = useState(null)
  const [loadingPdf, setLoadingPdf] = useState(false);

useEffect(() => {
  if (!document?.data?.data?.filePath) return;

  let cancelled = false;

  const loadPdf = async () => {
    try {
      setLoadingPdf(true);

      const url = document.data.data.filePath;

      const res = await fetch(url);
      const buffer = await res.arrayBuffer();

      const blob = new Blob([buffer], {
        type: "application/pdf",
      });

      const blobUrl = URL.createObjectURL(blob);

      // 🔐 ONLY set if still mounted
      if (!cancelled) {
        setPdfUrl(blobUrl);
      }
    } catch (e) {
      console.error("PDF load failed", e);
    } finally {
      setLoadingPdf(false);
    }
  };

  loadPdf();

  return () => {
    cancelled = true;
    setPdfUrl((old) => {
      if (old?.startsWith("blob:")) URL.revokeObjectURL(old);
      return null;
    });
  };
}, [document?.data?.data?.filePath]);

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const data = await documentService.getDocumentsById(id)
        setDocument(data)
        
      } catch (error) {
        toast.error("Failed to fetch document details.")
        console.error(error)
      }finally{
        setLoading(false)
      }
    }

    fetchDocumentDetails()
  }, [id])




  const renderContent = (() => {
    if(loading){
      return (<>Loading...</>)
    }

    if(!document || !document.data || !document.data.data.filePath) {
      return <div className=''>PDF not available</div>
    }

    return (
      <div className='bg-white border-gray-300 rounded-lg overflow-hidden shadow-sm'>
        <div className='flex items-center justify-between p-4 bg-gray-50 border-b border-gray-300'>
          <span className='text-sm font-medium text-gray-700'>Document Viewer</span>
          <a 
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className='inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors'
            >
              <ExternalLink size={16} />
              Open in new tab
            </a>
        </div>
        <div className='bg-gray-100 p-1'>
          {pdfUrl && pdfUrl.startsWith("blob:") && <iframe src={pdfUrl} className='w-full h-[70vh] bg-white rounded border border-gray-300' title='PDF Viewer' style={{colorScheme: 'light'}} />}
        </div>
      </div>
    )
  })

  const renderChat = () => {
    return <ChatInterface />
  }

  const renderAIActions = () => {
    return <AIActions />
  }

  const renderFlashcardsTab = () => {
    return <FlashcardManager documentId={id} />
  }

  const renderQuizTab = () => {
    return <QuizManager documentId={id} />
  }
  const tabs = [
    {
      name: 'Content',
      label: 'Content',
      content: renderContent()
    },
    {
      name: 'Chat',
      label: 'Chat',
      content: renderChat()
    },
    {
      name: 'AI Actions',
      label: 'AI Actions',
      content: renderAIActions()
    },
    {
      name: 'Flashcards',
      label: 'Flashcards',
      content: renderFlashcardsTab()
    },
    {
      name: 'Quiz',
      label: 'Quiz',
      content: renderQuizTab()
    }
  ]

  if(loading){
    return <>Loading...</>
  }

  if(!document){
    return <div className='text-center p-8'>Document not found</div>
  }

  return (
    <div>
      <div className=''>
        <Link to='/documents' className='inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors'>
          <ArrowLeft size={16}/>
          Back to Documents
        </Link>
      </div>
      <PageHeader title={document.data.title}/>
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab}/>
    </div>
  )
}

export default DocumentDetailPage