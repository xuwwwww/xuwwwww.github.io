/* =========================================================
   Louis Wu ??? Portfolio Scripts
   ========================================================= */

const langSwitchButton = document.getElementById('lang-switch');
const langSwitchLabel = document.getElementById('lang-switch-label');
const bodyElement = document.body;
const htmlElement = document.documentElement;
let currentLang = 'en';

/* ---------------- Project Detail Registry ---------------- */
const PROJECTS = {
  'moe-dugan': {
    en: {
      period: '2024 ??? Present',
      title: 'MoE-DUGAN: Generative Denoising for Low-Dose CT',
      org: 'Lab of AI & Computer Vision Â· NTUST',
      tags: ['PyTorch', 'GAN', 'DDPM', 'Mixture of Experts', 'Medical Imaging'],
      summary:
        'A research project extending Dual-Discriminator GANs with a Mixture-of-Experts adaptive loss-weighting module for multi-modal medical image denoising (CT / MRI / Ultrasound).',
      sections: [
        {
          heading: 'Highlights',
          bullets: [
            'Designed the MoE-DUGAN framework extending Dual-Discriminator GANs for Low-Dose CT (LDCT) denoising.',
            'Implemented a ???Noise Expert??? module (Mixture of Experts) that dynamically adjusts adversarial loss weights across modalities.',
            'Validated on multi-modal datasets including CT, MRI, and Ultrasound to assess generalization.',
          ],
        },
        {
          heading: 'Tech Stack',
          stack: ['PyTorch', 'Residual Denoising', 'DDPM (Diffusion Models)', 'Probability Simulation', 'Machine Learning'],
        },
      ],
    },
    zh: {
      period: '2024å¹? ??? ??³ä??',
      title: 'MoE-DUGANï¼?ä½??????? CT ??????å¼???»é??è¨?',
      org: 'AI ?????»è?¦è??è¦ºå¯¦é©?å®? Â· NTUST',
      tags: ['PyTorch', 'GAN', 'DDPM', 'Mixture of Experts', '??«å­¸å½±å??'],
      summary:
        'å»¶ä¼¸ Dual-Discriminator GANsï¼??????? Mixture-of-Experts ??????èª¿æ?´å?????å¼? loss æ¬???????æ¨¡ç??ï¼??????¨æ?¼å??æ¨¡æ????«å­¸å½±å??ï¼?CT / MRI / è¶???³æ³¢ï¼???»é??è¨????',
      sections: [
        {
          heading: '???ç©¶äº®é»?',
          bullets: [
            'è¨­è?? MoE-DUGAN ??¶æ??ï¼?å»¶ä¼¸ Dual-Discriminator GANs ??¨æ?¼ä???????? CTï¼?LDCTï¼???»é??è¨????',
            'å¯¦ä?????Noise Expert???æ¨¡ç??ï¼?Mixture of Expertsï¼?ï¼???¨å??æ¨¡æ??è³?????????????èª¿æ?´å?????å¼? loss æ¬???????',
            '??? CT???MRI???è¶???³æ³¢ç­?å¤?æ¨¡æ??è³????ä¸?é©?è­?æ¨¡å??æ³??????½å?????',
          ],
        },
        {
          heading: '???è¡?',
          stack: ['PyTorch', 'Residual Denoising', 'DDPMï¼???´æ??æ¨¡å??ï¼?', 'æ©????æ¨¡æ??', 'æ©???¨å­¸ç¿?'],
        },
      ],
    },
  },

  'clinical-nlp': {
    en: {
      period: '2023 ??? Present',
      title: 'LLM-Guided Retrieval for Clinical Narratives (RAG)',
      org: 'Lab of Medical Imaging Â· NTUST',
      tags: ['PyTorch', 'RAG', 'LoRA', 'BioBERT', 'NLP'],
      summary:
        'A hybrid retrieval system for long-form clinical narratives, combining a chunked BioBERT retriever, sparse cross-chunk aggregation, and LLM-based equivalence judging for diagnosis re-ranking.',
      sections: [
        {
          heading: 'Highlights',
          bullets: [
            'Built a hybrid LLM-guided retrieval system for clinical narratives using a chunked BioBERT retriever with sparse cross-chunk aggregation.',
            'Improved the RAG pipeline by applying LLM-based equivalence judging for diagnosis re-ranking, enhancing search precision.',
          ],
        },
        {
          heading: 'Conference',
          bullets: [
            'Oral & Poster presentation at the 2025 IPAS Conference (NTUST ?? Yonsei University).',
          ],
        },
        {
          heading: 'Tech Stack',
          stack: ['PyTorch', 'Hugging Face Transformers', 'RAG', 'LoRA', 'NLP', 'Machine Learning'],
        },
      ],
    },
    zh: {
      period: '2023å¹? ??? ??³ä??',
      title: '??·ç????¨å?????è¿°ç?? LLM å°?å¼?æª¢ç´¢ï¼?RAGï¼?',
      org: '??«å­¸å½±å??å¯¦é??å®? Â· NTUST',
      tags: ['PyTorch', 'RAG', 'LoRA', 'BioBERT', 'NLP'],
      summary:
        '???å°???·ç????¨å?????è¿°è¨­è¨????æ··å??å¼?æª¢ç´¢ç³»çµ±ï¼?ä»¥å??æ®? BioBERT æª¢ç´¢??¨æ?­é??ç¨????è·¨ç??æ®µè?????ï¼?ä¸¦ä»¥ LLM ç­???¹å?¤å????¨é?²è??è¨ºæ?·é?????åº????',
      sections: [
        {
          heading: '???ç©¶äº®é»?',
          bullets: [
            'å»ºç½®??·ç????¨å?????è¿°ç??æ··å??å¼? LLM å°?å¼?æª¢ç´¢ç³»çµ±ï¼?ä»¥å??æ®? BioBERT æª¢ç´¢??¨æ?­é??ç¨????è·¨ç??æ®µè????????',
            'ä»? LLM ç­???¹å?¤å????¨é?²è??è¨ºæ?·é?????åº?ï¼???¹å?? RAG æª¢ç´¢ç²¾åº¦???',
          ],
        },
        {
          heading: '???è­°ç?¼è¡¨',
          bullets: [
            '2025 IPAS Conferenceï¼????ç«???ºç??ç§????å¤§å­¸ ?? å»¶ä??å¤§å­¸ï¼??????­è??æµ·å?±ç?¼è¡¨???',
          ],
        },
        {
          heading: '???è¡?',
          stack: ['PyTorch', 'Hugging Face Transformers', 'RAG', 'LoRA', 'NLP', 'æ©???¨å­¸ç¿?'],
        },
      ],
    },
  },

  'emg': {
    en: {
      period: '2025',
      title: 'EMG Signal Prediction',
      org: 'Independent Project',
      tags: ['CNN+GRU', 'MediaPipe', 'Real-time', 'Bio-signal'],
      summary:
        'Low-latency EMG signal processing for grasp-strength estimation. Spectrogram-based 2D CNN sliding window + GRU pipeline, fused with MediaPipe pose data.',
      sections: [
        {
          heading: 'Highlights',
          bullets: [
            'Converted EMG signals into spectrograms for 2D CNN sliding-window analysis.',
            'Combined CNN feature extraction with a GRU temporal model.',
            'Integrated MediaPipe to fuse vision-based hand pose information with EMG estimates.',
            'Achieved low-latency, real-time grasp-strength prediction.',
          ],
        },
      ],
    },
    zh: {
      period: '2025',
      title: 'EMG è¨???????æ¸?',
      org: '???äººå??æ¡?',
      tags: ['CNN+GRU', 'MediaPipe', '??³æ??', '?????«è?????'],
      summary:
        'EMG è¨??????????ï¼?å°?è¨????è½??????»è?????ï¼???­é?? 2D CNN æ»????çª? + GRUï¼?ä¸¦è?? MediaPipe è¦?è¦ºè???????????ï¼???????ä½?å»¶é?²æ????¨æ????¡å???????¤æ?·ã??',
      sections: [
        {
          heading: '???ç©¶äº®é»?',
          bullets: [
            'å°? EMG è¨????è½??????»è?????ï¼?ä½¿ç?? 2D CNN æ»????çª???²è????¹å¾µ??½å?????',
            'çµ???? CNN ??¹å¾µ??? GRU ???åº?æ¨¡å????²è?????æ¸¬ã??',
            '??´å?? MediaPipeï¼?å°??????¨å§¿???è³?è¨???? EMG ä¼°è???????????',
            '??????ä½?å»¶é?²ã????³æ??????????¡å????????æ¸¬ã??',
          ],
        },
      ],
    },
  },

  'brain-tumor': {
    en: {
      period: '2024',
      title: 'Optimized Model for Brain Tumor Segmentation',
      org: 'Independent Project',
      tags: ['U-Net', 'Segmentation', 'PyTorch'],
      summary:
        'Customized dataset and data loader applied to a U-Net pipeline for brain tumor segmentation.',
      sections: [
        {
          heading: 'Highlights',
          bullets: [
            'Built a customized dataset and data loader to handle medical imaging formats.',
            'Applied U-Net architecture for tumor segmentation with optimized training pipeline.',
          ],
        },
      ],
    },
    zh: {
      period: '2024',
      title: '??¦ç?¤å????²æ??ä½³å??æ¨¡å??',
      org: '???äººå??æ¡?',
      tags: ['U-Net', 'å½±å????????', 'PyTorch'],
      summary:
        '??ªè??è³?????????? data loaderï¼??????¨æ?? U-Net ??¦ç?¤å????²ã??',
      sections: [
        {
          heading: '???ç©¶äº®é»?',
          bullets: [
            'å»ºç½®??ªè??è³?????????? data loaderï¼?????????«å­¸å½±å????¼å?????',
            'ä½¿ç?? U-Net ??¶æ????²è????«ç?¤å????²ï??ä¸¦å?ªå??è¨?ç·´æ??ç¨????',
          ],
        },
      ],
    },
  },

  'bci': {
    en: {
      period: '2024',
      title: 'Brain-Computer Interface Research Group',
      org: 'NTUST',
      tags: ['EEG', 'Reading Group'],
      summary: 'EEG reading group and literature sharing focused on brain-computer interface research.',
      sections: [
        { heading: 'Highlights', bullets: ['Led & participated in EEG reading group sessions.', 'Shared literature reviews on BCI methods and applications.'] },
      ],
    },
    zh: {
      period: '2024',
      title: '??¦æ??ä»???¢ç??ç©¶å??çµ?',
      org: 'NTUST',
      tags: ['EEG', 'è®???¸æ??'],
      summary: '???å°???¦æ??ä»???¢ç??ç©¶ç?? EEG è®???¸æ??????????»å??äº«ã??',
      sections: [
        { heading: 'äº®é??', bullets: ['ä¸»æ??????????? EEG è®???¸æ?????', '???äº? BCI ??¹æ??????????¨ç???????»å??é¡§ã??'] },
      ],
    },
  },

  'solidworks': {
    en: {
      period: '2023',
      title: 'SolidWorks Educational Videos',
      org: 'NTU Racing Team',
      tags: ['SolidWorks', 'Simulation', 'Teaching'],
      summary: 'Teaching stress simulation and topology optimization to NTU Racing Team structural members.',
      sections: [
        { heading: 'Highlights', bullets: ['Produced educational videos on stress simulation.', 'Covered topology optimization workflows for chassis components.'] },
      ],
    },
    zh: {
      period: '2023',
      title: 'SolidWorks ???å­¸å½±???',
      org: '??°å¤§è³½è?????',
      tags: ['SolidWorks', 'æ¨¡æ??', '???å­?'],
      summary: '????????????æ¨¡æ?¬è???????²å?ªå??çµ? NTU è³½è?????çµ?æ§?çµ???¡ã??',
      sections: [
        { heading: 'äº®é??', bullets: ['è£½ä????????æ¨¡æ?¬æ??å­¸å½±??????', 'æ¶µè??è»???¶å??ä»¶æ????²å?ªå??æµ?ç¨????'] },
      ],
    },
  },

  'blind-cane': {
    en: {
      period: '2022',
      title: 'AI-Powered Blind Cane',
      org: 'Independent Project',
      tags: ['Raspberry Pi', 'Image Recognition', 'Embedded'],
      summary: 'Built an assistive cane using Raspberry Pi with onboard image recognition.',
      sections: [
        { heading: 'Highlights', bullets: ['Used Raspberry Pi as the processing core.', 'Integrated image recognition for obstacle awareness.'] },
      ],
    },
    zh: {
      period: '2022',
      title: '??ºæ?§å????²æ??',
      org: '???äººå??æ¡?',
      tags: ['Raspberry Pi', 'å½±å??è¾¨è??', 'åµ???¥å??'],
      summary: 'ä½¿ç?? Raspberry Pi ??ºæ?¸å??ï¼???­è??å½±å??è¾¨è???????½ã??',
      sections: [
        { heading: 'äº®é??', bullets: ['ä»? Raspberry Pi ä½???ºè???????¸å?????', '??´å??å½±å??è¾¨è??ä»¥æ??ç¤ºé??ç¤???©ã??'] },
      ],
    },
  },

  'iot-fridge': {
    en: {
      period: '2022',
      title: 'IoT Refrigerator',
      org: 'Independent Project',
      tags: ['IoT', 'Thermoelectric', 'Embedded'],
      summary: 'Compact refrigerator with remote monitoring and thermoelectric cooling.',
      sections: [
        { heading: 'Highlights', bullets: ['Designed thermoelectric cooling subsystem.', 'Added remote monitoring of internal temperature.'] },
      ],
    },
    zh: {
      period: '2022',
      title: 'IoT ??°ç®±',
      org: '???äººå??æ¡?',
      tags: ['IoT', '??±é?»è?´å??', 'åµ???¥å??'],
      summary: '??·é??ç«¯ç????§è????±é?»è?´å?·å????½ç??å°??????°ç®±???',
      sections: [
        { heading: 'äº®é??', bullets: ['è¨­è????±é?»è?´å?·å??ç³»çµ±???', '?????¥é??ç«¯å?§é?¨æº«åº¦ç????§ã??'] },
      ],
    },
  },

  'rc-plane': {
    en: {
      period: '2022',
      title: 'Remote-Controlled Airplane',
      org: 'Independent Project',
      tags: ['Arduino', 'SolidWorks', 'Mechanical'],
      summary: 'Designed and built an RC airplane using Arduino and SolidWorks.',
      sections: [
        { heading: 'Highlights', bullets: ['Modeled airframe in SolidWorks.', 'Used Arduino for flight control electronics.'] },
      ],
    },
    zh: {
      period: '2022',
      title: '?????§é??æ©?',
      org: '???äººå??æ¡?',
      tags: ['Arduino', 'SolidWorks', 'æ©?æ¢?'],
      summary: 'ä½¿ç?? Arduino ??? SolidWorks è£½ä??????????§é??æ©????',
      sections: [
        { heading: 'äº®é??', bullets: ['ä»? SolidWorks å»ºæ¨¡æ©?èº«ã??', 'ä½¿ç?? Arduino è£½ä??é£???§é?»å?????'] },
      ],
    },
  },

  'ev-bike': {
    en: {
      period: '2024',
      title: 'Electric Bicycle',
      org: 'Independent Project',
      tags: ['EV', 'Mechanical', 'Power Electronics'],
      summary: 'Designed and built an electric bicycle independently.',
      sections: [
        { heading: 'Highlights', bullets: ['Designed mechanical and electrical systems end-to-end.', 'Independently sourced and integrated components.'] },
      ],
    },
    zh: {
      period: '2024',
      title: '??»å????ªè??è»?',
      org: '???äººå??æ¡?',
      tags: ['??»å??è»?', 'æ©?æ¢?', '??»å????»å??'],
      summary: '??ªè??è¨­è?????è£½ä???????»å????ªè??è»????',
      sections: [
        { heading: 'äº®é??', bullets: ['??¨ç??è¨­è??æ©?æ¢°è????»æ°£ç³»çµ±???', '??ªè????¡è³¼?????´å????¶ç??ä»¶ã??'] },
      ],
    },
  },

  'mediatek': {
    en: {
      period: '2019',
      title: 'MediaTek Funded Science Fair Project',
      org: 'High School',
      tags: ['Science Fair', 'Funded'],
      summary: 'Participated in a science fair project with full funding from MediaTek.',
      sections: [
        { heading: 'Highlights', bullets: ['Awarded full project funding from MediaTek.', 'Presented project at the science fair.'] },
      ],
    },
    zh: {
      period: '2019',
      title: '??¯ç?¼ç??è£???©ç??å±?å°?æ¡?',
      org: 'é«?ä¸?',
      tags: ['ç§?å±?', 'è£????'],
      summary: '??²è?¯ç?¼ç????¨é??è£???©ï????????ç§?å­¸å??è¦½ã??',
      sections: [
        { heading: 'äº®é??', bullets: ['??²è?¯ç?¼ç????¨é??å°?æ¡?è£???©ã??', '??¼ç??å­¸å??è¦½ä¸­??¼è¡¨å°?æ¡????'] },
      ],
    },
  },
};

const AWARDS = {
  'coding-101': {
    en: {
      period: 'Top 5',
      title: 'Coding 101',
      org: 'Coding101 / Programming Literacy Initiative',
      tags: ['Top 5', 'Programming Competition', 'Software Collaboration'],
      summary: 'Placed fifth in Coding 101, a competition centered on programming literacy, collaborative software creation, and practical implementation.',
      sections: [
        {
          heading: 'What the competition is',
          bullets: [
            'Coding 101 is a programming competition designed to strengthen programming literacy, computational thinking, and collaborative software creation.',
            'Teams submit software work, explain key code and implementation choices, and are evaluated on originality, applicability, completeness, and engineering practice.',
          ],
        },
        {
          heading: 'My result',
          bullets: ['Top 5 finish.'],
        },
        {
          heading: 'Official page',
          links: [{ label: 'Coding 101 competition info', url: 'https://2025.coding101.tw/activities' }],
        },
      ],
    },
    zh: {
      period: 'ç¬¬ä?????',
      title: 'Coding 101',
      org: 'Coding101 / ç¨?å¼?ç´?é¤?ç«¶è³½',
      tags: ['ç¬¬ä?????', 'ç¨?å¼?ç«¶è³½', 'è»?é«????ä½?'],
      summary: '??? Coding 101 ???å¾?ç¬¬ä?????????????¯ä????´ä»¥ç¨?å¼?ç´?é¤???????ä½??????¼è??å¯¦ä????½å????ºä¸»è»¸ç??ç¨?å¼?ç«¶è³½???',
      sections: [
        {
          heading: 'æ¯?è³½å?¨å??ä»?éº?',
          bullets: [
            'Coding 101 ??¨å?¨å¼·???ç¨?å¼?ç´?é¤???????ç®????ç¶­ï??ä»¥å???????????ä½???²è??è»?é«???µä???????½å?????',
            '???ä¼????è¦????äº¤è??é«?ä½???????èªªæ?????é»?ç¨?å¼?è¨­è?????å¯¦ä????¹å??ï¼?ä¸¦ä???????µæ?§ã???????¨æ?§ã??å®????åº¦è??å·¥ç??å¯¦è??ç­???¢å??è©???????',
          ],
        },
        {
          heading: '?????????ç¸?',
          bullets: ['ç¬¬ä????????'],
        },
        {
          heading: 'å®???¹é?????',
          links: [{ label: 'Coding 101 ç«¶è³½è³?è¨?', url: 'https://2025.coding101.tw/activities' }],
        },
      ],
    },
  },

  'metro-2025': {
    en: {
      period: '2025',
      title: 'Taipei Metro Hackathon (AI & UI/UX)',
      org: 'Taipei Rapid Transit Corporation',
      tags: ['3rd Place', 'AI', 'UI/UX', 'Prototype'],
      summary: 'Won third place by leading a cross-functional team and shipping an AI MVP around the Taipei Metro Go app experience.',
      sections: [
        {
          heading: 'What the competition is',
          bullets: [
            'An app-focused hackathon centered on AI enablement plus UI/UX redesign for the Taipei Metro Go app.',
            'Teams were evaluated on UI/UX design, content innovation, and prototype feasibility.',
          ],
        },
        {
          heading: 'My result',
          bullets: [
            'Third Place in 2025.',
            'Led the team through concept framing, execution, and deadline delivery.',
          ],
        },
        {
          heading: 'Official page',
          links: [{ label: '2025 Taipei Metro Hackathon', url: 'https://2025hackathon.metro.taipei/' }],
        },
      ],
    },
    zh: {
      period: '2025',
      title: '??°å????·é??é»?å®¢æ?¾ï??AI ??? UI/UXï¼?',
      org: '??ºå??å¤§ç?¾æ?·é????¡ä»½????????¬å??',
      tags: ['ç¬¬ä?????', 'AI', 'UI/UX', 'Prototype'],
      summary: '??²å??ç¬¬ä?????ï¼?ä¸¦å¸¶???è·¨è?·è?½å?????å®????ä¸???????ç¹???°å????·é?? Go App é«?é©???? AI MVP???',
      sections: [
        {
          heading: 'æ¯?è³½å?¨å??ä»?éº?',
          bullets: [
            '?????¯ä????´ä»¥??°å????·é?? Go App ??ºæ?¸å?????é»?å®¢æ?¾ï??ä¸»è»¸??? AI è³¦è?½è?? UI/UX ??ªå??è¨­è?????',
            'è©???????é»?æ¶µè?? UI/UX è¨­è???????§å®¹??µæ?°è??????????¯è????§ã??',
          ],
        },
        {
          heading: '?????????ç¸?',
          bullets: [
            '2025 å¹´ç¬¬ä¸???????',
            'è²?è²¬å¸¶????????´å????¹å??ä¸¦å?¨æ???????§å???????¯æ??ä½??????????',
          ],
        },
        {
          heading: 'å®???¹é?????',
          links: [{ label: '2025 ??·é?????é»?å®¢æ??', url: 'https://2025hackathon.metro.taipei/' }],
        },
      ],
    },
  },

  'sustainability-2024': {
    en: {
      period: '2024',
      title: 'Sustainability Smart Innovation Hackathon',
      org: 'Sustainability Hackathon Taiwan',
      tags: ['Champion', 'SDGs', 'Enterprise Challenge'],
      summary: 'Won the championship in a sustainability-focused hackathon built around SDGs, resilience, and enterprise-backed problem statements.',
      sections: [
        {
          heading: 'What the competition is',
          bullets: [
            'A student hackathon guided by the UN Sustainable Development Goals.',
            'Teams respond to real enterprise problem statements with technology-enabled sustainable innovation proposals.',
          ],
        },
        {
          heading: 'My result',
          bullets: ['Champion.'],
        },
        {
          heading: 'Official page',
          links: [{ label: '2024 Sustainability Smart Innovation Hackathon', url: 'https://sustainabilityhackathon-tw.org/%E6%B0%B8%E7%BA%8C%E6%99%BA%E6%85%A7%E5%89%B5%E6%96%B0%E9%BB%91%E5%AE%A2%E6%9D%BE%E7%AB%B6%E8%B3%BD%E5%8D%B3%E5%B0%87%E6%8B%89%E9%96%8B%E5%BA%8F%E5%B9%95/' }],
        },
      ],
    },
    zh: {
      period: '2024',
      title: 'æ°¸ç????ºæ?§å?µæ?°é??å®¢æ??',
      org: 'æ°¸ç????ºæ?§å?µæ?°é??å®¢æ?¾ç«¶è³?',
      tags: ['???è»?', 'SDGs', 'ä¼?æ¥­å?½é??'],
      summary: '??¨ä»¥ SDGs????????§è??ä¼?æ¥­å?½é????ºæ?¸å?????æ°¸ç??é»?å®¢æ?¾ä¸­??²å?????è»????',
      sections: [
        {
          heading: 'æ¯?è³½å?¨å??ä»?éº?',
          bullets: [
            'ç«¶è³½ä»¥è?¯å????? 17 ???æ°¸ç????¼å????®æ????ºä¸»è»¸ï??å¼·èª¿æ°¸ç???????ºæ?§ã????µæ?°è???????§ã??',
            '???è³½è????????å°?ä¼?æ¥­æ????ºç?????å¯¦å?½é??ï¼???¼å????·ç?????å°???????æ°¸ç????µæ?°æ?¹æ?????',
          ],
        },
        {
          heading: '?????????ç¸?',
          bullets: ['???è»????'],
        },
        {
          heading: 'å®???¹é?????',
          links: [{ label: '2024 æ°¸ç????ºæ?§å?µæ?°é??å®¢æ??', url: 'https://sustainabilityhackathon-tw.org/%E6%B0%B8%E7%BA%8C%E6%99%BA%E6%85%A7%E5%89%B5%E6%96%B0%E9%BB%91%E5%AE%A2%E6%9D%BE%E7%AB%B6%E8%B3%BD%E5%8D%B3%E5%B0%87%E6%8B%89%E9%96%8B%E5%BA%8F%E5%B9%95/' }],
        },
      ],
    },
  },

  'voc-2023': {
    en: {
      period: '2023',
      title: 'Vocational Cup Hackathon Â· Northern Preliminary',
      org: 'Ministry of Education Vocational Cup Hackathon',
      tags: ['Merit Award', 'Northern Preliminary', 'Makerthon'],
      summary: 'Received a Merit Award in the 2023 northern preliminary round.',
      sections: [
        {
          heading: 'What the competition is',
          bullets: [
            'A two-stage vocational college makerthon that asks teams to build prototypes on site under time pressure.',
            'The competition emphasizes technical execution, creativity, presentation, design, and value creation.',
          ],
        },
        {
          heading: 'My result',
          bullets: ['2023 Northern Preliminary Â· Merit Award.'],
        },
        {
          heading: 'Official page',
          links: [{ label: 'Vocational Cup Hackathon overview', url: 'https://competition.npust.edu.tw/competition/2024%E5%B9%B4%E6%8A%80%E8%81%B7%E7%9B%83%E9%BB%91%E5%AE%A2%E6%9D%BE%E7%AB%B6%E8%B3%BD/' }],
        },
      ],
    },
    zh: {
      period: '2023',
      title: '?????·ç??é»?å®¢æ?? Â· ?????????è³?',
      org: '?????²é?¨æ????·ç??é»?å®¢æ?¾ç«¶è³?',
      tags: ['ä½³ä??', '?????????è³?', 'Makerthon'],
      summary: '??? 2023 å¹´å????????è³½ç?²å??ä½³ä?????',
      sections: [
        {
          heading: 'æ¯?è³½å?¨å??ä»?éº?',
          bullets: [
            '?????¯ä????´å?©é??æ®µç???????? Makerthonï¼????è³½é??ä¼????è¦???¨ç?¾å?´é?????å®????ä½?????????????',
            'è©??????¢å???????«æ??è¡??????µæ?????ç°¡å?±ã??è¨­è??ï¼?ä»¥å????µé????¹å?¼ã??',
          ],
        },
        {
          heading: '?????????ç¸?',
          bullets: ['2023 ?????????è³½ä½³ä½????'],
        },
        {
          heading: 'å®???¹é?????',
          links: [{ label: '?????·ç??é»?å®¢æ?¾ç«¶è³½èªª???', url: 'https://competition.npust.edu.tw/competition/2024%E5%B9%B4%E6%8A%80%E8%81%B7%E7%9B%83%E9%BB%91%E5%AE%A2%E6%9D%BE%E7%AB%B6%E8%B3%BD/' }],
        },
      ],
    },
  },

  'voc-2024-north': {
    en: {
      period: '2024',
      title: 'Vocational Cup Hackathon Â· 2024 Northern Regional',
      org: 'Ministry of Education Vocational Cup Hackathon',
      tags: ['Champion', 'Regional Winner', 'Makerthon'],
      summary: 'Won the championship in the 2024 northern regional round of the Vocational Cup Hackathon.',
      sections: [
        {
          heading: 'What the competition is',
          bullets: [
            'The 2024 edition used affordable clean energy as the competition theme.',
            'Projects could be hardware, web services, apps, mechatronics, or interactive systems, all built during the event.',
          ],
        },
        {
          heading: 'My result',
          bullets: ['2024 Northern Regional Champion.'],
        },
        {
          heading: 'Official page',
          links: [{ label: '2024 Vocational Cup Hackathon', url: 'https://competition.npust.edu.tw/competition/2024%E5%B9%B4%E6%8A%80%E8%81%B7%E7%9B%83%E9%BB%91%E5%AE%A2%E6%9D%BE%E7%AB%B6%E8%B3%BD/' }],
        },
      ],
    },
    zh: {
      period: '2024',
      title: '?????·ç??é»?å®¢æ?? Â· 2024 ??????è³?',
      org: '?????²é?¨æ????·ç??é»?å®¢æ?¾ç«¶è³?',
      tags: ['???è»?', '??????è³?', 'Makerthon'],
      summary: '??? 2024 ?????·ç??é»?å®¢æ?¾æ?¿ä???????????è»????',
      sections: [
        {
          heading: 'æ¯?è³½å?¨å??ä»?éº?',
          bullets: [
            '2024 å¹´ç«¶è³½ä¸»é¡??????¦æ?¼ã????¯è????????æ½?æ·¨è?½æ?????ï¼?é¼???µå­¸?????¨è¨­è¨??????????å¯¦ä??è§?é¡????',
            'ä½????å½¢å??ä¸????ï¼???¯ç?ºå¯¦é«?ä½???????ç¶²é???????????App???æ©???»æ?´å?????äº????æ©?æ§?ï¼?ä¸¦æ?¼æ??è³½ç?¾å?´å????????',
          ],
        },
        {
          heading: '?????????ç¸?',
          bullets: ['2024 ?????????è»????'],
        },
        {
          heading: 'å®???¹é?????',
          links: [{ label: '2024 ?????·ç??é»?å®¢æ??', url: 'https://competition.npust.edu.tw/competition/2024%E5%B9%B4%E6%8A%80%E8%81%B7%E7%9B%83%E9%BB%91%E5%AE%A2%E6%9D%BE%E7%AB%B6%E8%B3%BD/' }],
        },
      ],
    },
  },

  'voc-2024-final': {
    en: {
      period: '2024',
      title: 'Vocational Cup Hackathon Â· 2024 National Final',
      org: 'Ministry of Education Vocational Cup Hackathon',
      tags: ['Best Value Creation', '2nd Overall', 'National Final'],
      summary: 'Received the Best Value Creation Award in the 2024 national final, corresponding to second overall.',
      sections: [
        {
          heading: 'What the competition is',
          bullets: [
            'The national final continues the same makerthon format but gathers top teams from multiple regions for the final round.',
            'Judging still emphasizes technical execution, creativity, design, presentation, and how much value the prototype can create.',
          ],
        },
        {
          heading: 'My result',
          bullets: ['2024 National Final Best Value Creation Award (2nd overall).'],
        },
        {
          heading: 'Official page',
          links: [{ label: '2024 Vocational Cup Hackathon', url: 'https://competition.npust.edu.tw/competition/2024%E5%B9%B4%E6%8A%80%E8%81%B7%E7%9B%83%E9%BB%91%E5%AE%A2%E6%9D%BE%E7%AB%B6%E8%B3%BD/' }],
        },
      ],
    },
    zh: {
      period: '2024',
      title: '?????·ç??é»?å®¢æ?? Â· 2024 ??¨å??æ±ºè³½',
      org: '?????²é?¨æ????·ç??é»?å®¢æ?¾ç«¶è³?',
      tags: ['???ä½³å?µé????¹å??', 'ç¸½æ?????ç¬¬ä??', '??¨å??æ±ºè³½'],
      summary: '??? 2024 ??¨å??æ±ºè³½??²å?????ä½³å?µé????¹å?¼ç??ï¼?å°????ç¸½æ?????ç¬¬ä?????',
      sections: [
        {
          heading: 'æ¯?è³½å?¨å??ä»?éº?',
          bullets: [
            '??¨å??æ±ºè³½å»¶ç?????æ¨???? Makerthon ??¶æ??ï¼?ä½????çµ????????????ªå?????ä¼???²è?????çµ?ç«¶è³½???',
            'è©?å¯©ä?????è¦????è¡?å®????åº¦ã????µæ?????è¨­è?????ç°¡å?±è??ä½??????½å?µé?????å¯¦é????¹å?¼ã??',
          ],
        },
        {
          heading: '?????????ç¸?',
          bullets: ['2024 ??¨å??æ±ºè³½???ä½³å?µé????¹å?¼ç??ï¼?ç¸½æ?????ç¬? 2ï¼????'],
        },
        {
          heading: 'å®???¹é?????',
          links: [{ label: '2024 ?????·ç??é»?å®¢æ??', url: 'https://competition.npust.edu.tw/competition/2024%E5%B9%B4%E6%8A%80%E8%81%B7%E7%9B%83%E9%BB%91%E5%AE%A2%E6%9D%BE%E7%AB%B6%E8%B3%BD/' }],
        },
      ],
    },
  },

  'voc-2025-north': {
    en: {
      period: '2025',
      title: 'Vocational Cup Hackathon Â· 2025 Northern Regional',
      org: 'Ministry of Education Vocational Cup Hackathon',
      tags: ['Champion', 'Regional Winner', 'Makerthon'],
      summary: 'Won the championship in the 2025 northern regional round.',
      sections: [
        {
          heading: 'What the competition is',
          bullets: [
            'The 2025 edition kept the same core makerthon structure: topic reveal on site, live prototyping, and multi-dimensional judging.',
            'Official materials also explicitly allowed AI-assisted creation when accompanied by a disclosure statement.',
          ],
        },
        {
          heading: 'My result',
          bullets: ['2025 Northern Regional Champion.'],
        },
        {
          heading: 'Official page',
          links: [{ label: '2025 Vocational Cup Hackathon materials', url: 'https://www.lit.edu.tw/wp-content/uploads/2025/03/2025%E5%B9%B4%E6%8A%80%E8%81%B7%E7%9B%83%E9%BB%91%E5%AE%A2%E6%9D%BE%E7%AB%B6%E8%B3%BD%E6%B4%BB%E5%8B%95%E8%B3%87%E6%96%99.pdf' }],
        },
      ],
    },
    zh: {
      period: '2025',
      title: '?????·ç??é»?å®¢æ?? Â· 2025 ??????è³?',
      org: '?????²é?¨æ????·ç??é»?å®¢æ?¾ç«¶è³?',
      tags: ['???è»?', '??????è³?', 'Makerthon'],
      summary: '2025 å¹´å??æ¬¡æ?¿ä???????????è»????',
      sections: [
        {
          heading: 'æ¯?è³½å?¨å??ä»?éº?',
          bullets: [
            '2025 å¹´ç¶­?????¾å?´æ?½é?????????????????è£½ä?????å¤???¢å??è©?å¯©ç?? Makerthon çµ?æ§????',
            'å®???¹è?????ä¹????ç¢ºå??è¨±ä½¿??? AI ???ä½???µä??ï¼?ä½?????????????ä¸???µä????²æ?????',
          ],
        },
        {
          heading: '?????????ç¸?',
          bullets: ['2025 ?????????è»????'],
        },
        {
          heading: 'å®???¹é?????',
          links: [{ label: '2025 ?????·ç??é»?å®¢æ?¾æ´»???è³????', url: 'https://www.lit.edu.tw/wp-content/uploads/2025/03/2025%E5%B9%B4%E6%8A%80%E8%81%B7%E7%9B%83%E9%BB%91%E5%AE%A2%E6%9D%BE%E7%AB%B6%E8%B3%BD%E6%B4%BB%E5%8B%95%E8%B3%87%E6%96%99.pdf' }],
        },
      ],
    },
  },

  'voc-2025-final': {
    en: {
      period: '2025',
      title: 'Vocational Cup Hackathon Â· 2025 National Final',
      org: 'Ministry of Education Vocational Cup Hackathon',
      tags: ['National Final Merit', 'National Final', 'Makerthon'],
      summary: 'Earned a Merit Award in the 2025 national final.',
      sections: [
        {
          heading: 'What the competition is',
          bullets: [
            'The national final is the culminating round of the vocational makerthon, bringing regional winners together on one stage.',
            'Teams still need to prove both prototype quality and the clarity of their value proposition within a short build-and-pitch cycle.',
          ],
        },
        {
          heading: 'My result',
          bullets: ['2025 National Final Merit Award.'],
        },
        {
          heading: 'Official page',
          links: [{ label: '2025 Vocational Cup Hackathon materials', url: 'https://www.lit.edu.tw/wp-content/uploads/2025/03/2025%E5%B9%B4%E6%8A%80%E8%81%B7%E7%9B%83%E9%BB%91%E5%AE%A2%E6%9D%BE%E7%AB%B6%E8%B3%BD%E6%B4%BB%E5%8B%95%E8%B3%87%E6%96%99.pdf' }],
        },
      ],
    },
    zh: {
      period: '2025',
      title: '?????·ç??é»?å®¢æ?? Â· 2025 ??¨å??æ±ºè³½',
      org: '?????²é?¨æ????·ç??é»?å®¢æ?¾ç«¶è³?',
      tags: ['æ±ºè³½ä½³ä??', '??¨å??æ±ºè³½', 'Makerthon'],
      summary: '??? 2025 ??¨å??æ±ºè³½??²å??ä½³ä?????',
      sections: [
        {
          heading: 'æ¯?è³½å?¨å??ä»?éº?',
          bullets: [
            '??¨å??æ±ºè³½??¯æ????? Makerthon ??????çµ????æ®µï?????çµ????????????ªå?????ä¼??????´ç«¶??????',
            '???ä¼???¤ä??å®????ä½????ï¼?ä¹?è¦???¨ç?­æ???????§èªªæ¸?æ¥?ä½??????¹å?¼ã?????è¡?å®????åº¦è??è¨­è???????????',
          ],
        },
        {
          heading: '?????????ç¸?',
          bullets: ['2025 ??¨å??æ±ºè³½ä½³ä?????'],
        },
        {
          heading: 'å®???¹é?????',
          links: [{ label: '2025 ?????·ç??é»?å®¢æ?¾æ´»???è³????', url: 'https://www.lit.edu.tw/wp-content/uploads/2025/03/2025%E5%B9%B4%E6%8A%80%E8%81%B7%E7%9B%83%E9%BB%91%E5%AE%A2%E6%9D%BE%E7%AB%B6%E8%B3%BD%E6%B4%BB%E5%8B%95%E8%B3%87%E6%96%99.pdf' }],
        },
      ],
    },
  },

  'make-ntu': {
    en: {
      period: 'Selected participation',
      title: 'MakeNTU / NTU EE Makerthon',
      org: 'NTU EE student-led makerthon',
      tags: ['Maker', 'Hardware + Software', 'Rapid Prototype'],
      summary: 'A campus makerthon focused on creativity, technical execution, and balanced hardware-software integration under a tight build window.',
      sections: [
        {
          heading: 'What the competition is',
          bullets: [
            'MakeNTU is a makerthon organized around creativity, technical execution, and integrated hardware-software prototyping.',
            'Teams build and demo a working concept within a short intensive event window.',
          ],
        },
        {
          heading: 'My result',
          bullets: ['Selected participant / featured competition experience.'],
        },
        {
          heading: 'Official page',
          links: [{ label: 'MakeNTU overview', url: 'https://alumni.ee.ntu.edu.tw/?p=3280' }],
        },
      ],
    },
    zh: {
      period: '??????ç¶?æ­?',
      title: 'MakeNTU / ??°å¤§??»æ????µå®¢???',
      org: '??°å¤§??»æ??å­¸ç??ä¸»è¾¦??µå®¢???',
      tags: ['Maker', 'è»?ç¡¬æ?´å??', 'å¿«é????????'],
      summary: '?????¯ä????´å¼·èª¿å?µæ????????è¡????è»?ç¡¬æ?´å???????µå®¢??¾ï??è¦???¨ç?­æ???????§å?????ä½????ä¸¦é?²è?? Demo???',
      sections: [
        {
          heading: 'æ¯?è³½å?¨å??ä»?éº?',
          bullets: [
            'MakeNTU ä»¥å?µæ????????è¡????è»?ç¡¬é????´å??ä¸¦é????ºä¸»è»¸ï??è¦?æ±????ä¼???¨å????????ç¨???§å??????????????',
            'æ¯?è³½é??è¦?????????????è·¨é????????ä½?ï¼?ä»¥å???????³æ??å¿«é??è½??????¯å??ç¤ºç??ä½???????',
          ],
        },
        {
          heading: '??????ç¶?æ­?',
          bullets: ['ä½???ºé??è¦???????ç«¶è³½ç¶?æ­·å????¥ã??'],
        },
        {
          heading: '????????????',
          links: [{ label: 'MakeNTU ä»?ç´?', url: 'https://alumni.ee.ntu.edu.tw/?p=3280' }],
        },
      ],
    },
  },

  'tirt-2019': {
    en: {
      period: '2019',
      title: 'Humanoid Challenge, TIRT 2019',
      org: 'TIRT International Robot Festival',
      tags: ['Champion', 'Humanoid Robotics'],
      summary: 'Won the humanoid challenge category in TIRT, one of Taiwan???s largest robot competition festivals.',
      sections: [
        {
          heading: 'What the competition is',
          bullets: [
            'TIRT is a large-scale robot competition festival in Taiwan built to expand robotics education and connect local teams with an international stage.',
            'Its event structure includes multiple robot competition formats, including humanoid robot categories.',
          ],
        },
        {
          heading: 'My result',
          bullets: ['Champion in the humanoid challenge event.'],
        },
        {
          heading: 'Official page',
          links: [{ label: 'TIRT official site', url: 'https://www.tirtpointsrace.org/' }],
        },
      ],
    },
    zh: {
      period: '2019',
      title: '??°ç????????æ©???¨äººå¤§è³½ TIRT äººå½¢æ©???¨äºº?????°è³½',
      org: 'TIRT ????????°å?µæ????¨äººç¯?',
      tags: ['???è»?', 'äººå½¢æ©???¨äºº'],
      summary: '??? TIRT äººå½¢æ©???¨äºº?????°è³½??¿ä?????è»????TIRT ??¬èº«??¯å?°ç??å¤§å??æ©???¨äººç«¶è³½????????²æ?¨å»£å¹³å?°ã??',
      sections: [
        {
          heading: 'æ¯?è³½å?¨å??ä»?éº?',
          bullets: [
            'TIRT ??¯å?°ç??å¤§å??æ©???¨äººç«¶è³½ç¯?ï¼???®æ????¯æ?¨å??æ©???¨äºº?????²ä¸¦è®???°ç???????ºå?????è³½ä???????°ã??',
            '??´é??æ´»å???????«å??ç¨®æ????¨äººç«¶è³½å½¢å??ï¼???¶ä¸­ä¹?æ¶µè??äººå½¢æ©???¨äººé¡???¥ã??',
          ],
        },
        {
          heading: '?????????ç¸?',
          bullets: ['äººå½¢æ©???¨äºº?????°è³½???è»????'],
        },
        {
          heading: 'å®???¹é?????',
          links: [{ label: 'TIRT å®???¹ç¶²ç«?', url: 'https://www.tirtpointsrace.org/' }],
        },
      ],
    },
  },

  'wro-2017': {
    en: {
      period: '2017',
      title: 'World Robot Olympiad Taiwan Finals',
      org: 'World Robot Olympiad',
      tags: ['Top 5', 'Robotics', 'Problem Solving'],
      summary: 'Reached the top five in the Taiwan finals of WRO, a global robotics competition centered on creativity, engineering, and problem solving.',
      sections: [
        {
          heading: 'What the competition is',
          bullets: [
            'WRO is a global robotics competition focused on creativity, engineering, and problem-solving skills.',
            'It is platform-agnostic, so teams can compete with different robot brands and custom parts as long as they meet category rules.',
          ],
        },
        {
          heading: 'My result',
          bullets: ['Top 5 in the Taiwan finals.'],
        },
        {
          heading: 'Official page',
          links: [{ label: 'WRO official overview', url: 'https://wro-association.org/about-wro/wro-is-for-everyone/' }],
        },
      ],
    },
    zh: {
      period: '2017',
      title: 'WRO ä¸????æ©???¨äººå¤§è³½??°ç??æ±ºè³½',
      org: 'World Robot Olympiad',
      tags: ['???äº????', 'æ©???¨äºº', 'è§?é¡???½å??'],
      summary: '??? WRO ??°ç??æ±ºè³½??¿ä?????äº???????WRO ??¯ä?????å¼·èª¿??µæ?????å·¥ç?????è§?é¡???½å???????¨ç??æ©???¨äººç«¶è³½???',
      sections: [
        {
          heading: 'æ¯?è³½å?¨å??ä»?éº?',
          bullets: [
            'WRO ??¯å?¨ç????§ç??æ©???¨äººç«¶è³½ï¼???¸å????¨å?¹é????µé????????å·¥ç????½å????????é¡?è§?æ±ºè?½å?????',
            'å®???¡é????¾å¹³??°ç²¾ç¥?ï¼???ªè??ç¬¦å??çµ???¥è??ç¯?ï¼?å°±è?½ä½¿??¨ä??????????????æ©???¨äºº?????ªè£½??¶ä»¶???è³½ã??',
          ],
        },
        {
          heading: '?????????ç¸?',
          bullets: ['??°ç??æ±ºè³½???äº???????'],
        },
        {
          heading: 'å®???¹é?????',
          links: [{ label: 'WRO å®???¹ä??ç´?', url: 'https://wro-association.org/about-wro/wro-is-for-everyone/' }],
        },
      ],
    },
  },

  'roboone-2020': {
    en: {
      period: '2020',
      title: 'ROBO-ONE Japan 2020',
      org: 'ROBO-ONE / Biped Robot Association',
      tags: ['Top 32', 'Humanoid Battle', 'Japan'],
      summary: 'Placed in the top 32 at ROBO-ONE in Japan, a long-running official tournament series for biped humanoid robots.',
      sections: [
        {
          heading: 'What the competition is',
          bullets: [
            'ROBO-ONE is an official tournament series for biped humanoid robots.',
            'Its certified-tournament system gives strong performers qualification rights into ROBO-ONE finals.',
          ],
        },
        {
          heading: 'My result',
          bullets: ['Top 32 in Japan.'],
        },
        {
          heading: 'Official page',
          links: [{ label: 'ROBO-ONE official tournaments', url: 'https://www.robo-one.com/en/competitions/' }],
        },
      ],
    },
    zh: {
      period: '2020',
      title: '??¥æ?? ROBO-ONE 2020',
      org: 'ROBO-ONE / äº?è¶³æ­¥è¡?æ©???¨äºº??????',
      tags: ['ä¸????äº?å¼?', 'äººå½¢æ©???¨äºº', '??¥æ??'],
      summary: '??¨æ?¥æ?? ROBO-ONE ???å¾?ä¸????äº?å¼·ã??ROBO-ONE ??¯é??å°????è¶³äººå½¢æ????¨äºº???å®???¹è³½äº?ç³»å?????',
      sections: [
        {
          heading: 'æ¯?è³½å?¨å??ä»?éº?',
          bullets: [
            'ROBO-ONE ??¯é??è¶³äººå½¢æ????¨äºº???å®???¹ç«¶è³½ç³»??????',
            'å®???????èª?è­?è³½å?¶åº¦è®??????°å?ªç?????ä¼????å¾????ç´? ROBO-ONE æ±ºè³½???è³???¼ã??',
          ],
        },
        {
          heading: '?????????ç¸?',
          bullets: ['??¥æ?? ROBO-ONE ä¸????äº?å¼·ã??'],
        },
        {
          heading: 'å®???¹é?????',
          links: [{ label: 'ROBO-ONE å®???¹è³½äº????', url: 'https://www.robo-one.com/en/competitions/' }],
        },
      ],
    },
  },
};

const DETAILS = { ...PROJECTS, ...AWARDS };
const DETAIL_RESOURCE_LINKS = {
  'moe-dugan': [
    { label: 'CS Poster', url: 'assets/research/CS_poster.pdf' },
  ],
  'clinical-nlp': [
    { label: 'EE Poster', url: 'assets/research/EE_poster.pdf' },
  ],
};

/* ---------------- Language Switch ---------------- */
function updateCopyTooltips(lang) {
  document.querySelectorAll('.copy-trigger').forEach((el) => {
    const tooltip = lang === 'en' ? el.dataset.tooltipEn : el.dataset.tooltipZh;
    el.dataset.tooltip = tooltip || '';
  });
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
}

function attachCopyHandlers() {
  document.querySelectorAll('.copy-trigger').forEach((el) => {
    if (el.dataset.copyBound === '1') return;
    el.dataset.copyBound = '1';
    el.addEventListener('click', async (e) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      const textToCopy = el.dataset.copy || el.textContent || '';
      try {
        await copyTextToClipboard(textToCopy);
        const copiedMsg = currentLang === 'en' ? el.dataset.copiedEn : el.dataset.copiedZh;
        const normalMsg = currentLang === 'en' ? el.dataset.tooltipEn : el.dataset.tooltipZh;
        el.dataset.tooltip = copiedMsg || '';
        el.classList.add('show-tooltip');
        setTimeout(() => {
          el.dataset.tooltip = normalMsg || '';
          el.classList.remove('show-tooltip');
        }, 900);
      } catch (err) {
        console.error('Copy failed:', err);
      }
    });
  });
}

function setLanguage(lang) {
  currentLang = lang;
  bodyElement.classList.remove('lang-en', 'lang-zh-TW');
  bodyElement.classList.add(`lang-${lang}`);
  if (langSwitchLabel) {
    langSwitchLabel.textContent = lang === 'en' ? 'ä¸­æ??' : 'English';
  }
  htmlElement.setAttribute('lang', lang === 'en' ? 'en' : 'zh-TW');
  try {
    const newTitle = document.querySelector(`title.lang-${lang}`).textContent;
    document.title = newTitle;
  } catch (e) {}
  updateCopyTooltips(lang);

  const mb = document.getElementById('project-modal');
  if (mb && mb.classList.contains('open') && currentDetailId && typeof renderDetail === 'function') {
    renderDetail(currentDetailId);
  }
}

langSwitchButton.addEventListener('click', () => {
  const newLang = currentLang === 'en' ? 'zh-TW' : 'en';
  langSwitchButton.classList.add('active-switch');
  setTimeout(() => langSwitchButton.classList.remove('active-switch'), 320);

  bodyElement.classList.add('page-lang-switching');
  setTimeout(() => {
    setLanguage(newLang);
    setTimeout(() => bodyElement.classList.remove('page-lang-switching'), 30);
  }, 240);
});

/* ---------------- Easter Egg: Snake ---------------- */
const easterEggBackdrop = document.getElementById('easter-egg');
const easterEggBoard = document.getElementById('easter-board');
const easterEggStatus = document.getElementById('easter-status');
const easterEggReset = document.getElementById('easter-reset');
const easterEggAuto = document.getElementById('easter-auto');
const easterEggScore = document.getElementById('easter-score');
const easterEggMode = document.getElementById('easter-mode');
const easterEggLive = document.getElementById('easter-live');
const easterEggControls = Array.from(document.querySelectorAll('.easter-control'));
const heroPhotoTrigger = document.getElementById('hero-photo-trigger');

const SNAKE_SIZE = 12;
const SNAKE_TARGET_LENGTH = SNAKE_SIZE * SNAKE_SIZE;
const SNAKE_FILL_THRESHOLD = Math.floor(SNAKE_TARGET_LENGTH * 0.7);
const SNAKE_TICK_MS = 110;
const SNAKE_AUTO_SPEED_MULTIPLIER = 1.2;
const SNAKE_START = [
  { x: 4, y: 6 },
  { x: 3, y: 6 },
  { x: 2, y: 6 },
];
const SNAKE_DIRECTIONS = [
  { key: 'up', dx: 0, dy: -1 },
  { key: 'right', dx: 1, dy: 0 },
  { key: 'down', dx: 0, dy: 1 },
  { key: 'left', dx: -1, dy: 0 },
];
const SNAKE_DIRECTION_MAP = {
  ArrowUp: 'up',
  KeyW: 'up',
  ArrowRight: 'right',
  KeyD: 'right',
  ArrowDown: 'down',
  KeyS: 'down',
  ArrowLeft: 'left',
  KeyA: 'left',
};
const SNAKE_OPPOSITE = {
  up: 'down',
  right: 'left',
  down: 'up',
  left: 'right',
};
const SNAKE_HAMILTONIAN_CYCLE = buildSnakeHamiltonianCycle();
const SNAKE_HAMILTONIAN_INDEX = new Map(
  SNAKE_HAMILTONIAN_CYCLE.map((point, index) => [toCycleKey(point.x, point.y), index]),
);

let easterBoardCells = [];
let snakeBody = [];
let snakeFood = null;
let snakeDirection = 'right';
let snakeNextDirection = 'right';
let snakeAutoSolve = false;
let snakeGameOver = false;
let snakeWon = false;
let snakeLoopTimer = null;

function easterText(en, zh) {
  return currentLang === 'zh-TW' ? zh : en;
}

function toCycleKey(x, y) {
  return `${x},${y}`;
}

function getCycleIndex(point) {
  return SNAKE_HAMILTONIAN_INDEX.get(toCycleKey(point.x, point.y));
}

function getCycleDistance(fromIndex, toIndex) {
  return (toIndex - fromIndex + SNAKE_TARGET_LENGTH) % SNAKE_TARGET_LENGTH;
}

function buildSnakeHamiltonianCycle() {
  const cycle = [];

  for (let x = 0; x < SNAKE_SIZE; x += 1) {
    cycle.push({ x, y: 0 });
  }

  for (let y = 1; y < SNAKE_SIZE; y += 1) {
    if (y % 2 === 1) {
      for (let x = SNAKE_SIZE - 1; x >= 1; x -= 1) {
        cycle.push({ x, y });
      }
    } else {
      for (let x = 1; x < SNAKE_SIZE; x += 1) {
        cycle.push({ x, y });
      }
    }
  }

  for (let y = SNAKE_SIZE - 1; y >= 1; y -= 1) {
    cycle.push({ x: 0, y });
  }

  return cycle;
}

function cloneSegment(segment) {
  return { x: segment.x, y: segment.y };
}

function toSnakeKey(point) {
  return `${point.x},${point.y}`;
}

function isSamePoint(a, b) {
  return a.x === b.x && a.y === b.y;
}

function getDirectionBetween(from, to) {
  if (!from || !to) return null;
  if (to.x === from.x && to.y === from.y - 1) return 'up';
  if (to.x === from.x + 1 && to.y === from.y) return 'right';
  if (to.x === from.x && to.y === from.y + 1) return 'down';
  if (to.x === from.x - 1 && to.y === from.y) return 'left';
  return null;
}

function isInsideBoard(point) {
  return point.x >= 0 && point.x < SNAKE_SIZE && point.y >= 0 && point.y < SNAKE_SIZE;
}

function getSnakeHead(body = snakeBody) {
  return body[0];
}

function getSnakeTail(body = snakeBody) {
  return body[body.length - 1];
}

function getDirectionVector(directionKey) {
  return SNAKE_DIRECTIONS.find((direction) => direction.key === directionKey);
}

function getNextPoint(point, directionKey) {
  const direction = getDirectionVector(directionKey);
  return { x: point.x + direction.dx, y: point.y + direction.dy };
}

function buildOccupiedSet(body, { ignoreTail = false } = {}) {
  const limit = ignoreTail ? body.length - 1 : body.length;
  const occupied = new Set();
  for (let index = 0; index < limit; index += 1) occupied.add(toSnakeKey(body[index]));
  return occupied;
}

function getLegalDirections(body = snakeBody, currentDirection = snakeDirection) {
  const head = getSnakeHead(body);
  const tail = getSnakeTail(body);
  const legalDirections = [];

  SNAKE_DIRECTIONS.forEach((direction) => {
    if (body.length > 1 && SNAKE_OPPOSITE[currentDirection] === direction.key) return;

    const nextPoint = getNextPoint(head, direction.key);
    if (!isInsideBoard(nextPoint)) return;

    const hitsBody = body.some((segment, index) => index < body.length - 1 && isSamePoint(segment, nextPoint));
    if (hitsBody && !isSamePoint(nextPoint, tail)) return;

    legalDirections.push(direction.key);
  });

  return legalDirections;
}

function simulateSnakeMove(body, directionKey, food) {
  const nextHead = getNextPoint(getSnakeHead(body), directionKey);
  if (!isInsideBoard(nextHead)) return null;

  const willEat = food && isSamePoint(nextHead, food);
  const occupied = buildOccupiedSet(body, { ignoreTail: !willEat });
  if (occupied.has(toSnakeKey(nextHead))) return null;

  const nextBody = [nextHead, ...body.map(cloneSegment)];
  if (!willEat) nextBody.pop();
  return { body: nextBody, ateFood: Boolean(willEat) };
}

function findShortestPath(body, target, { allowTail = true } = {}) {
  const start = getSnakeHead(body);
  if (isSamePoint(start, target)) return [];

  const blocked = buildOccupiedSet(body, { ignoreTail: allowTail });
  const queue = [{ point: start, path: [] }];
  const visited = new Set([toSnakeKey(start)]);

  while (queue.length) {
    const current = queue.shift();

    for (const direction of SNAKE_DIRECTIONS) {
      const nextPoint = getNextPoint(current.point, direction.key);
      const nextKey = toSnakeKey(nextPoint);
      if (!isInsideBoard(nextPoint) || visited.has(nextKey)) continue;
      if (blocked.has(nextKey) && !isSamePoint(nextPoint, target)) continue;

      const nextPath = [...current.path, direction.key];
      if (isSamePoint(nextPoint, target)) return nextPath;

      visited.add(nextKey);
      queue.push({ point: nextPoint, path: nextPath });
    }
  }

  return null;
}

function simulatePath(body, food, path) {
  let simulatedBody = body.map(cloneSegment);
  for (const directionKey of path) {
    const result = simulateSnakeMove(simulatedBody, directionKey, food);
    if (!result) return null;
    simulatedBody = result.body;
  }
  return simulatedBody;
}

function countReachableCells(startPoint, blocked) {
  const queue = [startPoint];
  const visited = new Set([toSnakeKey(startPoint)]);

  while (queue.length) {
    const point = queue.shift();
    for (const direction of SNAKE_DIRECTIONS) {
      const nextPoint = getNextPoint(point, direction.key);
      const nextKey = toSnakeKey(nextPoint);
      if (!isInsideBoard(nextPoint) || visited.has(nextKey) || blocked.has(nextKey)) continue;
      visited.add(nextKey);
      queue.push(nextPoint);
    }
  }

  return visited.size;
}

function pickTailChasingDirection(body = snakeBody, currentDirection = snakeDirection) {
  const legalDirections = getLegalDirections(body, currentDirection);
  let bestDirection = null;
  let bestScore = -1;

  legalDirections.forEach((directionKey) => {
    const result = simulateSnakeMove(body, directionKey, snakeFood);
    if (!result) return;

    const tailPath = findShortestPath(result.body, getSnakeTail(result.body), { allowTail: true });
    const blocked = buildOccupiedSet(result.body, { ignoreTail: true });
    const openScore = countReachableCells(getSnakeHead(result.body), blocked);
    const pathScore = tailPath ? tailPath.length : -1;
    const totalScore = pathScore >= 0 ? pathScore * 1000 + openScore : openScore;

    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestDirection = directionKey;
    }
  });

  return bestDirection || legalDirections[0] || null;
}

function getHamiltonianDirection(body = snakeBody) {
  const head = getSnakeHead(body);
  const headIndex = getCycleIndex(head);
  if (headIndex == null) return null;

  const nextPoint = SNAKE_HAMILTONIAN_CYCLE[(headIndex + 1) % SNAKE_HAMILTONIAN_CYCLE.length];
  const directionKey = getDirectionBetween(head, nextPoint);
  if (!directionKey) return null;

  const result = simulateSnakeMove(body, directionKey, snakeFood);
  return result ? directionKey : null;
}

function getHamiltonianShortcutDirection(body = snakeBody, currentDirection = snakeDirection) {
  const head = getSnakeHead(body);
  const tail = getSnakeTail(body);
  const food = snakeFood;
  const headIndex = getCycleIndex(head);
  const tailIndex = getCycleIndex(tail);
  const foodIndex = food ? getCycleIndex(food) : null;
  if (headIndex == null || tailIndex == null) return null;

  const headToTail = getCycleDistance(headIndex, tailIndex);
  const headToFood = foodIndex == null ? SNAKE_TARGET_LENGTH : getCycleDistance(headIndex, foodIndex);
  const foodIsAhead = foodIndex != null && headToFood < headToTail;
  const legalDirections = getLegalDirections(body, currentDirection);
  let bestDirection = null;
  let bestScore = -Infinity;

  legalDirections.forEach((directionKey) => {
    const result = simulateSnakeMove(body, directionKey, food);
    if (!result) return;

    const nextHead = getSnakeHead(result.body);
    const nextIndex = getCycleIndex(nextHead);
    if (nextIndex == null) return;

    const advance = getCycleDistance(headIndex, nextIndex);
    if (advance <= 0) return;

    const tailMargin = getCycleDistance(nextIndex, tailIndex);
    const safetyMargin = Math.max(
      result.ateFood ? 2 : 1,
      Math.min(10, Math.ceil((body.length - SNAKE_FILL_THRESHOLD + 1) / 5)),
    );
    if (tailMargin <= safetyMargin || advance >= headToTail) return;

    if (foodIsAhead && advance > headToFood) return;
    if (!foodIsAhead && advance !== 1) return;

    const tailPath = findShortestPath(result.body, getSnakeTail(result.body), { allowTail: true });
    if (!tailPath) return;

    const blocked = buildOccupiedSet(result.body, { ignoreTail: true });
    const openScore = countReachableCells(nextHead, blocked);
    const foodDistance = foodIndex == null ? SNAKE_TARGET_LENGTH : getCycleDistance(nextIndex, foodIndex);
    const followsCycle = advance === 1;
    const score =
      tailMargin * 100 +
      openScore * 10 +
      (followsCycle ? 300 : 0) -
      advance * 8 -
      foodDistance * 12;

    if (score > bestScore) {
      bestScore = score;
      bestDirection = directionKey;
    }
  });

  return bestDirection;
}

function getAutoSolveDirection() {
  const pathToFood = snakeFood ? findShortestPath(snakeBody, snakeFood, { allowTail: true }) : null;
  const isLatePhase = snakeBody.length >= SNAKE_FILL_THRESHOLD;

  if (!isLatePhase && pathToFood && pathToFood.length) {
    const simulatedBody = simulatePath(snakeBody, snakeFood, pathToFood);
    if (simulatedBody) {
      const canSeeTailAfterEating = findShortestPath(simulatedBody, getSnakeTail(simulatedBody), { allowTail: true });
      if (canSeeTailAfterEating) return pathToFood[0];
    }
  }

  if (isLatePhase) {
    const shortcutDirection = getHamiltonianShortcutDirection();
    if (shortcutDirection) return shortcutDirection;

    const cycleDirection = getHamiltonianDirection();
    if (cycleDirection) return cycleDirection;

    return pickTailChasingDirection();
  }

  if (pathToFood && pathToFood.length) {
    const simulatedBody = simulatePath(snakeBody, snakeFood, pathToFood);
    if (simulatedBody) {
      const canSeeTailAfterEating = findShortestPath(simulatedBody, getSnakeTail(simulatedBody), { allowTail: true });
      if (canSeeTailAfterEating) return pathToFood[0];
    }
  }

  return pickTailChasingDirection();
}

function placeSnakeFood() {
  const occupied = buildOccupiedSet(snakeBody);
  const emptyCells = [];

  for (let y = 0; y < SNAKE_SIZE; y += 1) {
    for (let x = 0; x < SNAKE_SIZE; x += 1) {
      const point = { x, y };
      if (!occupied.has(toSnakeKey(point))) emptyCells.push(point);
    }
  }

  snakeFood = emptyCells.length
    ? cloneSegment(emptyCells[Math.floor(Math.random() * emptyCells.length)])
    : null;
}

function updateEasterHud() {
  const score = Math.max(0, snakeBody.length - SNAKE_START.length);

  if (snakeWon) {
    easterEggStatus.textContent = easterText('Board cleared. Perfect run.', '\u5168\u5716\u5403\u6eff\u4e86\u3002');
  } else if (snakeGameOver) {
    easterEggStatus.textContent = easterText(`Game over. Score: ${score}`, `\u904a\u6232\u7d50\u675f\uff0c\u5206\u6578\uff1a${score}`);
  } else {
    easterEggStatus.textContent = easterText(`Score: ${score}`, `\u5206\u6578\uff1a${score}`);
  }

  if (easterEggScore) {
    easterEggScore.textContent = easterText(
      `Length ${snakeBody.length} / ${SNAKE_TARGET_LENGTH}`,
      `\u9577\u5ea6 ${snakeBody.length} / ${SNAKE_TARGET_LENGTH}`,
    );
  }

  if (easterEggMode) {
    easterEggMode.textContent = snakeAutoSolve
      ? easterText('Auto Solve', '\u81ea\u52d5\u89e3\u984c')
      : easterText('Manual', '\u624b\u52d5');
  }

  if (easterEggAuto) {
    easterEggAuto.textContent = snakeAutoSolve
      ? easterText('Auto Solve: On', 'Auto Solve\uff1a\u958b')
      : easterText('Auto Solve: Off', 'Auto Solve\uff1a\u95dc');
    easterEggAuto.classList.toggle('active', snakeAutoSolve);
  }

  if (easterEggLive) easterEggLive.textContent = easterEggStatus.textContent;
}

function renderSnakeBoard() {
  if (!easterEggBoard || !easterBoardCells.length) return;

  easterBoardCells.forEach((cell) => {
    cell.classList.remove(
      'cell-snake',
      'cell-head',
      'cell-food',
      'trail-up',
      'trail-right',
      'trail-down',
      'trail-left',
    );
  });

  if (snakeFood) {
    const foodIndex = snakeFood.y * SNAKE_SIZE + snakeFood.x;
    easterBoardCells[foodIndex]?.classList.add('cell-food');
  }

  snakeBody.forEach((segment, index) => {
    const cellIndex = segment.y * SNAKE_SIZE + segment.x;
    const cell = easterBoardCells[cellIndex];
    if (!cell) return;

    cell.classList.add('cell-snake');
    const previousSegment = snakeBody[index - 1];

    if (index === 0) {
      cell.classList.add('cell-head');
      return;
    }

    const trailDirection = previousSegment ? getDirectionBetween(segment, previousSegment) : null;
    if (trailDirection) cell.classList.add(`trail-${trailDirection}`);
  });

  updateEasterHud();
}

function buildSnakeBoard() {
  if (!easterEggBoard || easterBoardCells.length) return;

  easterEggBoard.innerHTML = '';
  easterBoardCells = Array.from({ length: SNAKE_TARGET_LENGTH }, (_, index) => {
    const cell = document.createElement('div');
    cell.className = 'easter-cell';
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', `cell-${index + 1}`);
    cell.innerHTML = `
      <span class="snake-trail" aria-hidden="true"></span>
      <span class="snake-core" aria-hidden="true"></span>
      <span class="snake-food-dot" aria-hidden="true"></span>
    `;
    easterEggBoard.appendChild(cell);
    return cell;
  });
}

function stopSnakeLoop() {
  if (snakeLoopTimer) {
    clearInterval(snakeLoopTimer);
    snakeLoopTimer = null;
  }
}

function startSnakeLoop() {
  stopSnakeLoop();
  const tickMs = snakeAutoSolve
    ? Math.max(16, Math.round(SNAKE_TICK_MS / SNAKE_AUTO_SPEED_MULTIPLIER))
    : SNAKE_TICK_MS;
  snakeLoopTimer = setInterval(stepSnakeGame, tickMs);
}

function finishSnakeGame({ won = false } = {}) {
  snakeGameOver = !won;
  snakeWon = won;
  stopSnakeLoop();
  renderSnakeBoard();
}

function stepSnakeGame() {
  if (snakeGameOver || snakeWon) return;

  if (snakeAutoSolve) {
    const autoDirection = getAutoSolveDirection();
    if (autoDirection) snakeNextDirection = autoDirection;
  }

  if (snakeBody.length > 1 && SNAKE_OPPOSITE[snakeDirection] === snakeNextDirection) {
    snakeNextDirection = snakeDirection;
  }

  const result = simulateSnakeMove(snakeBody, snakeNextDirection, snakeFood);
  if (!result) {
    finishSnakeGame();
    return;
  }

  snakeDirection = snakeNextDirection;
  snakeBody = result.body;

  if (result.ateFood) {
    if (snakeBody.length >= SNAKE_TARGET_LENGTH) {
      finishSnakeGame({ won: true });
      return;
    }
    placeSnakeFood();
  }

  renderSnakeBoard();
}

function resetEasterGame() {
  buildSnakeBoard();
  stopSnakeLoop();
  snakeBody = SNAKE_START.map(cloneSegment);
  snakeDirection = 'right';
  snakeNextDirection = 'right';
  snakeGameOver = false;
  snakeWon = false;
  placeSnakeFood();
  renderSnakeBoard();
  startSnakeLoop();
}

function openEasterEgg() {
  if (!easterEggBackdrop) return;
  snakeAutoSolve = true;
  resetEasterGame();
  easterEggBackdrop.classList.add('open');
  easterEggBackdrop.setAttribute('aria-hidden', 'false');
  bodyElement.classList.add('modal-open');
}

function closeEasterEgg() {
  if (!easterEggBackdrop) return;
  stopSnakeLoop();
  easterEggBackdrop.classList.remove('open');
  easterEggBackdrop.setAttribute('aria-hidden', 'true');
  if (!modalBackdrop || !modalBackdrop.classList.contains('open')) {
    bodyElement.classList.remove('modal-open');
  }
}

function setSnakeDirection(directionKey) {
  if (!directionKey) return;
  snakeAutoSolve = false;
  if (snakeBody.length > 1 && SNAKE_OPPOSITE[snakeDirection] === directionKey) return;
  snakeNextDirection = directionKey;
  updateEasterHud();
  startSnakeLoop();
}

if (heroPhotoTrigger && easterEggBackdrop && easterEggBoard && easterEggStatus && easterEggReset && easterEggAuto) {
  buildSnakeBoard();
  renderSnakeBoard();

  heroPhotoTrigger.addEventListener('click', openEasterEgg);
  heroPhotoTrigger.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openEasterEgg();
    }
  });

  easterEggReset.addEventListener('click', resetEasterGame);
  easterEggAuto.addEventListener('click', () => {
    snakeAutoSolve = !snakeAutoSolve;
    updateEasterHud();
    startSnakeLoop();
  });
  easterEggControls.forEach((button) => {
    button.addEventListener('click', () => {
      if (!easterEggBackdrop.classList.contains('open')) return;
      setSnakeDirection(button.dataset.direction);
    });
  });

  easterEggBackdrop.addEventListener('click', (event) => {
    if (event.target === easterEggBackdrop) closeEasterEgg();
  });
  document.addEventListener('keydown', (event) => {
    if (!easterEggBackdrop.classList.contains('open')) return;

    if (event.key === 'Escape') {
      closeEasterEgg();
      return;
    }

    const directionKey = SNAKE_DIRECTION_MAP[event.code] || SNAKE_DIRECTION_MAP[event.key];
    if (!directionKey) return;

    event.preventDefault();
    setSnakeDirection(directionKey);
  });
}

/* ---------------- Sticky Nav State ---------------- */
const topbar = document.getElementById('topbar');
function onScroll() {
  if (window.scrollY > 8) topbar.classList.add('scrolled');
  else topbar.classList.remove('scrolled');
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------------- Mobile Nav Toggle ---------------- */
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------------- Reveal-on-scroll ---------------- */
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  htmlElement.classList.add('js-reveal');

  // Mark anything already in viewport visible immediately to avoid blank flashes.
  const viewportH = window.innerHeight || document.documentElement.clientHeight;
  revealEls.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < viewportH * 0.95) el.classList.add('visible');
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px -10% 0px' }
  );
  revealEls.forEach((el) => {
    if (!el.classList.contains('visible')) io.observe(el);
  });

  // Failsafe: never let content stay hidden longer than 1.2s.
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.visible)').forEach((el) => el.classList.add('visible'));
  }, 1200);
}

/* ---------------- Active Section Highlight ---------------- */
const sectionIds = ['about', 'experience', 'projects', 'awards', 'skills', 'coursework'];
const navAnchors = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
const sectionMap = sectionIds
  .map((id) => ({ id, el: document.getElementById(id) }))
  .filter((x) => x.el);

if ('IntersectionObserver' in window && sectionMap.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navAnchors.forEach((a) => {
            a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );
  sectionMap.forEach((s) => sectionObserver.observe(s.el));
}

/* ---------------- Project Modal ---------------- */
const modalBackdrop = document.getElementById('project-modal');
const modalClose = document.getElementById('modal-close');
const modalPeriod = document.getElementById('modal-period');
const modalTitle = document.getElementById('modal-title');
const modalOrg = document.getElementById('modal-org');
const modalTags = document.getElementById('modal-tags');
const modalSummary = document.getElementById('modal-summary');
const modalSections = document.getElementById('modal-sections');
let currentDetailId = null;
let lastFocusedTrigger = null;

function renderDetail(id) {
  const detail = DETAILS[id];
  if (!detail) return;
  const data = detail[currentLang === 'zh-TW' ? 'zh' : 'en'] || detail.en;
  const extraLinks = DETAIL_RESOURCE_LINKS[id] || [];

  modalPeriod.textContent = data.period || '';
  modalTitle.textContent = data.title || '';
  modalOrg.textContent = data.org || '';

  modalTags.innerHTML = '';
  (data.tags || []).forEach((t) => {
    const el = document.createElement('span');
    el.className = 'tag';
    el.textContent = t;
    modalTags.appendChild(el);
  });

  modalSummary.textContent = data.summary || '';

  modalSections.innerHTML = '';
  (data.sections || []).forEach((sec) => {
    const h = document.createElement('h4');
    h.textContent = sec.heading;
    modalSections.appendChild(h);

    if (sec.bullets) {
      const ul = document.createElement('ul');
      sec.bullets.forEach((b) => {
        const li = document.createElement('li');
        li.textContent = b;
        ul.appendChild(li);
      });
      modalSections.appendChild(ul);
    }
    if (sec.stack) {
      const wrap = document.createElement('div');
      wrap.className = 'stack-row';
      sec.stack.forEach((s) => {
        const c = document.createElement('span');
        c.className = 'tag';
        c.textContent = s;
        wrap.appendChild(c);
      });
      modalSections.appendChild(wrap);
    }
    if (sec.links) {
      const wrap = document.createElement('div');
      wrap.className = 'modal-link-row';
      sec.links.forEach((link) => {
        const a = document.createElement('a');
        a.className = 'modal-link';
        a.href = link.url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = link.label;
        wrap.appendChild(a);
      });
      modalSections.appendChild(wrap);
    }
  });

  if (extraLinks.length) {
    const h = document.createElement('h4');
    h.textContent = currentLang === 'zh-TW' ? '\u6d77\u5831\u8207\u8cc7\u6599' : 'Posters & Resources';
    modalSections.appendChild(h);

    const wrap = document.createElement('div');
    wrap.className = 'modal-link-row';
    extraLinks.forEach((link) => {
      const a = document.createElement('a');
      a.className = 'modal-link';
      a.href = link.url;
      a.target = '_blank';
      a.rel = 'noreferrer';
      a.textContent = `${link.label} Â· ${currentLang === 'zh-TW' ? '\u5b8c\u6574\u958b\u555f' : 'Open full'}`;
      wrap.appendChild(a);
    });
    modalSections.appendChild(wrap);

    const preview = extraLinks[0];
    if (preview) {
      const previewWrap = document.createElement('div');
      previewWrap.className = 'modal-preview';

      const iframe = document.createElement('iframe');
      iframe.className = 'modal-preview-frame';
      iframe.src = `${preview.url}#page=1&view=FitH`;
      iframe.title = `${data.title} preview`;
      iframe.loading = 'lazy';

      previewWrap.appendChild(iframe);
      modalSections.appendChild(previewWrap);
    }
  }
}

function openDetail(id, trigger) {
  if (!DETAILS[id]) return;
  currentDetailId = id;
  lastFocusedTrigger = trigger || null;
  renderDetail(id);
  modalBackdrop.classList.add('open');
  modalBackdrop.setAttribute('aria-hidden', 'false');
  bodyElement.classList.add('modal-open');
  setTimeout(() => modalClose.focus(), 50);
}

function closeDetail() {
  modalBackdrop.classList.remove('open');
  modalBackdrop.setAttribute('aria-hidden', 'true');
  bodyElement.classList.remove('modal-open');
  currentDetailId = null;
  if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
    lastFocusedTrigger.focus();
  }
}

document.querySelectorAll('[data-project]').forEach((card) => {
  card.addEventListener('click', () => openDetail(card.dataset.project, card));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openDetail(card.dataset.project, card);
    }
  });
});

document.querySelectorAll('.project-resource-link, .project-preview-frame').forEach((el) => {
  el.addEventListener('click', (event) => event.stopPropagation());
  el.addEventListener('keydown', (event) => event.stopPropagation());
});

document.querySelectorAll('.project-preview-toggle').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    const resource = button.closest('.project-resource');
    const preview = resource?.querySelector('.project-preview');
    if (!preview) return;
    const nextExpanded = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', nextExpanded ? 'true' : 'false');
    preview.hidden = !nextExpanded;
  });
  button.addEventListener('keydown', (event) => event.stopPropagation());
});

document.querySelectorAll('[data-award]').forEach((card) => {
  card.addEventListener('click', () => openDetail(card.dataset.award, card));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openDetail(card.dataset.award, card);
    }
  });
});

modalClose.addEventListener('click', closeDetail);
modalBackdrop.addEventListener('click', (e) => {
  if (e.target === modalBackdrop) closeDetail();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) closeDetail();
});

/* ---------------- Initialize ---------------- */
setLanguage(currentLang);
attachCopyHandlers();
