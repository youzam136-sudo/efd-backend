import '@mantine/core/styles.css';
import '@blocknote/core/style.css';
import '@blocknote/react/style.css';
import '@blocknote/mantine/style.css';
import companyLogo from './extensions/logo.png';

export default {
  config: {
    head: {
      title: 'EFD 관리자 페이지',
    },
    auth: {
      logo: companyLogo,
    },
    menu: {
      logo: companyLogo,
    },
    translations: {
      en: {
        'Auth.form.welcome.title': 'Welcome to Korean Transport App',
        'Auth.form.welcome.subtitle': 'Log in to your account',
        'Auth.form.register.subtitle': ' ',
        'app.components.LeftMenu.navbrand.title': 'Korean Transport App',
      },
      ko: {
        'Auth.form.welcome.title': 'EFD 관리자 페이지',
        'Auth.form.welcome.subtitle': '계정에 로그인하세요',
        'Auth.form.register.subtitle': ' ',
        'Auth.form.button.login': '로그인',
        'Auth.form.button.password.forgot': '비밀번호를 잊으셨나요?',
        'app.components.LeftMenu.navbrand.title': 'EFD 관리자',
        'global.save': '저장',
        'global.cancel': '취소',
        'global.delete': '삭제',
        'global.search': '검색',
        'global.back': '뒤로',
        'global.yes': '예',
        'global.no': '아니오',
      },
    },
    locales: ['ko'],
  },
  register(app: any) {
    app.customFields.register({
      name: 'blocknote',
      pluginId: 'cms-editor',
      type: 'richtext',
      intlLabel: {
        id: 'cms-editor.blocknote.label',
        defaultMessage: 'BlockNote Editor',
      },
      intlDescription: {
        id: 'cms-editor.blocknote.description',
        defaultMessage: 'Notion-style rich text editor',
      },
      components: {
        Input: async () =>
          import('./components/BlockNoteEditor').then((m) => ({ default: m.default })),
      },
    });
  },
  bootstrap() {
    if (localStorage.getItem('STRAPI_THEME') !== 'light') {
      localStorage.setItem('STRAPI_THEME', 'light');
      window.location.reload();
    }

    // Favicon 강제 교체
    const setFavicon = () => {
      const existing = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
      if (existing) {
        existing.href = companyLogo as string;
      } else {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/png';
        link.href = companyLogo as string;
        document.head.appendChild(link);
      }
    };
    setFavicon();

    // White-label: Strapi 브랜딩 및 프리미엄/Cloud 메뉴 제거
    const style = document.createElement('style');
    style.textContent = `
      /* Marketplace 메뉴 숨김 */
      a[href="https://market.strapi.io"] { display: none !important; }
      a[aria-label="마켓플레이스"] { display: none !important; }
      a[href*="market.strapi.io"] { display: none !important; }
      /* Help 버튼 숨김 */
      a[href="https://strapi.io/support"] { display: none !important; }
      /* 하단 Strapi 로고/링크 숨김 */
      #main-navigation a[href*="strapi.io"] { display: none !important; }
      /* 사이드바 Cloud 플러그인 숨김 */
      a[href*="cloud"] { display: none !important; }
      /* 설정 - EE 전용 번개(⚡) 항목 숨김 */
      a[href="/settings/content-history"] { display: none !important; }
      a[href="/settings/releases"] { display: none !important; }
      a[href="/settings/review-workflows"] { display: none !important; }
      a[href="/settings/sso"] { display: none !important; }
      a[href="/settings/audit-logs"] { display: none !important; }
    `;
    document.head.appendChild(style);

    const hideElements = () => {
      // 뉴스레터 입력 숨김
      const newsInput = document.querySelector('input[name="news"]');
      if (newsInput) {
        const wrapper = newsInput.closest('div');
        if (wrapper) (wrapper as HTMLElement).style.display = 'none';
      }

      // 세부 정보 섹션 숨김 (Strapi 버전, 에디션, 업그레이드 링크)
      document.querySelectorAll('h3, h2').forEach((el) => {
        if (el.textContent?.trim() === '세부 정보' || el.textContent?.trim() === 'Details') {
          const section = el.closest('section') || el.parentElement;
          if (section) (section as HTMLElement).style.display = 'none';
        }
      });
    };

    // 엑셀 다운로드 플로팅 버튼 (React 렌더링 영향 없음)
    const createFloatingBtn = () => {
      if (document.getElementById('csv-export-btn')) return;
      const btn = document.createElement('button');
      btn.id = 'csv-export-btn';
      btn.textContent = '⬇ 엑셀 다운로드';
      btn.style.cssText = `
        position:fixed; bottom:24px; right:24px; z-index:9999;
        display:none; align-items:center; white-space:nowrap;
        padding:10px 20px;
        background:#4945ff; color:#fff;
        border:none; border-radius:8px;
        cursor:pointer; font-size:13px; font-weight:600;
        box-shadow:0 4px 12px rgba(73,69,255,0.4);
      `;
      btn.onmouseenter = () => { btn.style.background = '#3b37cc'; };
      btn.onmouseleave = () => { btn.style.background = '#4945ff'; };
      btn.onclick = () => {
        const m = window.location.pathname.match(/collection-types\/([^/?#]+)/);
        if (!m) { alert('콜렉션 페이지에서만 사용 가능합니다'); return; }
        const uid = decodeURIComponent(m[1]);
        window.open(`/api/export/csv?uid=${encodeURIComponent(uid)}`, '_blank');
      };
      document.body.appendChild(btn);
    };

    const injectCsvButton = () => {
      createFloatingBtn();
      const btn = document.getElementById('csv-export-btn') as HTMLElement | null;
      if (!btn) return;
      const onCollectionPage = window.location.pathname.includes('collection-types');
      btn.style.display = onCollectionPage ? 'inline-flex' : 'none';
    };

    const observer = new MutationObserver(() => {
      hideElements();
      injectCsvButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  },
};
