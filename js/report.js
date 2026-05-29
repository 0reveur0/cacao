/**
 * CACAO — Modal gắn cờ vi phạm (ES Module)
 */
import { auth, db, getAuth, FieldValue, createAuditLog } from './firebase-config.js';
import { translations, currentLang, initLanguage } from './lang.js';

let selectedCategory = null;
let modalElements = null;

function t(key) {
    return translations[currentLang][key] || key;
}

function ensureReportModal() {
    if (modalElements && document.body.contains(modalElements.overlay)) {
        return modalElements;
    }

    const overlay = document.createElement('div');
    overlay.id = 'cacao-report-overlay';
    overlay.className = 'hidden fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'cacao-report-title');

    overlay.innerHTML = (
        '<div class="relative w-full max-w-md rounded-2xl border-2 border-black bg-[#1A1A1A] shadow-[8px_8px_0_0_#E07A5F] p-6 sm:p-8" style="font-family:Genos,sans-serif">' +
            '<button type="button" id="cacao-report-close" class="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-lg border-2 border-black bg-gray-800 hover:bg-gray-700 font-black text-xl leading-none" aria-label="Close">&times;</button>' +
            '<h2 id="cacao-report-title" class="text-2xl font-black uppercase tracking-wide text-[#E07A5F] pr-10" data-i18n="report.modal.title">Gắn cờ vi phạm</h2>' +
            '<p class="text-gray-400 font-semibold mt-2 mb-5 text-sm" data-i18n="report.modal.subtitle">Chọn lý do — mod sẽ kiểm tra</p>' +
            '<div class="space-y-3" id="cacao-report-reasons">' +
                '<button type="button" class="report-reason-btn w-full text-left px-4 py-3 rounded-xl border-2 border-black bg-white/5 hover:bg-[#E07A5F]/20 font-bold uppercase tracking-wide transition-all" data-category="spam" data-i18n="report.reason.spam">Spam</button>' +
                '<button type="button" class="report-reason-btn w-full text-left px-4 py-3 rounded-xl border-2 border-black bg-white/5 hover:bg-[#E07A5F]/20 font-bold uppercase tracking-wide transition-all" data-category="harmful" data-i18n="report.reason.harmful">Độc hại</button>' +
                '<button type="button" class="report-reason-btn w-full text-left px-4 py-3 rounded-xl border-2 border-black bg-white/5 hover:bg-[#E07A5F]/20 font-bold uppercase tracking-wide transition-all" data-category="wrong" data-i18n="report.reason.wrong">Sai kiến thức</button>' +
            '</div>' +
            '<div class="mt-5">' +
                '<label for="cacao-report-note" class="block text-xs font-bold uppercase text-gray-500 mb-2" data-i18n="report.note.label">Ghi chú thêm</label>' +
                '<textarea id="cacao-report-note" rows="3" maxlength="500" class="w-full bg-[#101010] border-2 border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-[#E07A5F] focus:outline-none resize-none" data-i18n-placeholder="swal.placeholder.report"></textarea>' +
            '</div>' +
            '<div class="flex gap-3 mt-6">' +
                '<button type="button" id="cacao-report-cancel" class="flex-1 py-3 rounded-xl border-2 border-black font-bold uppercase bg-gray-800 hover:bg-gray-700" data-i18n="swal.cancel">Hủy</button>' +
                '<button type="button" id="cacao-report-submit" class="flex-1 py-3 rounded-xl border-2 border-black font-bold uppercase bg-[#E07A5F] hover:bg-[#d46a4d] text-white shadow-[4px_4px_0_0_#000] disabled:opacity-40 disabled:cursor-not-allowed" disabled data-i18n="report.send">Gửi cờ</button>' +
            '</div>' +
        '</div>'
    );

    document.body.appendChild(overlay);

    modalElements = {
        overlay: overlay,
        submitBtn: overlay.querySelector('#cacao-report-submit'),
        noteInput: overlay.querySelector('#cacao-report-note'),
        reasonButtons: overlay.querySelectorAll('.report-reason-btn'),
    };

    overlay.querySelector('#cacao-report-close').addEventListener('click', closeReportModal);
    overlay.querySelector('#cacao-report-cancel').addEventListener('click', closeReportModal);
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
            closeReportModal();
        }
    });

    modalElements.reasonButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            selectedCategory = btn.getAttribute('data-category');
            modalElements.reasonButtons.forEach(function (b) {
                b.classList.remove('ring-2', 'ring-[#E07A5F]', 'bg-[#E07A5F]/25');
            });
            btn.classList.add('ring-2', 'ring-[#E07A5F]', 'bg-[#E07A5F]/25');
            modalElements.submitBtn.disabled = false;
        });
    });

    initLanguage();
    return modalElements;
}

function openReportModal() {
    const els = ensureReportModal();
    selectedCategory = null;
    els.noteInput.value = '';
    els.submitBtn.disabled = true;
    els.reasonButtons.forEach(function (b) {
        b.classList.remove('ring-2', 'ring-[#E07A5F]', 'bg-[#E07A5F]/25');
    });
    initLanguage();
    els.overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeReportModal() {
    if (modalElements && modalElements.overlay) {
        modalElements.overlay.classList.add('hidden');
    }
    document.body.style.overflow = '';
    selectedCategory = null;
}

function buildReasonLabel(category) {
    const map = {
        spam: t('report.reason.spam'),
        harmful: t('report.reason.harmful'),
        wrong: t('report.reason.wrong'),
    };
    return map[category] || category;
}

export function reportContent(contentId, contentType, reasonOrMeta) {
    return new Promise(function (resolve, reject) {
        if (!contentId || !contentType) {
            reject(new Error('contentId và contentType là bắt buộc'));
            return;
        }

        let meta = {};
        if (typeof reasonOrMeta === 'string') {
            meta.prefillNote = reasonOrMeta;
        } else if (reasonOrMeta && typeof reasonOrMeta === 'object') {
            meta = reasonOrMeta;
        }

        openReportModal();
        const els = ensureReportModal();
        if (meta.prefillNote) {
            els.noteInput.value = meta.prefillNote;
        }

        els.submitBtn.onclick = async function () {
            if (!selectedCategory) {
                return;
            }

            const note = els.noteInput.value.trim();
            const reasonLabel = buildReasonLabel(selectedCategory);
            const fullReason = note ? reasonLabel + ' — ' + note : reasonLabel;

            els.submitBtn.disabled = true;
            closeReportModal();

            try {
                await getAuth();
                if (!auth.currentUser) {
                    reject(new Error('Bạn cần đăng nhập để gắn cờ'));
                    return;
                }

                const reportData = {
                    contentId: String(contentId),
                    contentType: String(contentType),
                    reportCategory: selectedCategory,
                    reason: fullReason,
                    reporterUid: auth.currentUser.uid,
                    reporterEmail: auth.currentUser.email || '',
                    status: 'pending',
                    timestamp: FieldValue.serverTimestamp(),
                };

                if (meta.courseId) {
                    reportData.courseId = String(meta.courseId);
                }
                if (meta.courseTitle) {
                    reportData.courseTitle = String(meta.courseTitle);
                }

                await db.collection('reports').add(reportData);
                await createAuditLog('content_reported', {
                    contentType: contentType,
                    contentId: contentId,
                    reportCategory: selectedCategory,
                    courseId: meta.courseId || null,
                });

                if (typeof Swal !== 'undefined') {
                    await Swal.fire({
                        icon: 'success',
                        title: t('swal.title.sent'),
                        text: t('swal.text.report_thanks'),
                        background: '#1A1A1A',
                        color: '#EFEFEF',
                        confirmButtonColor: '#E07A5F',
                    });
                }
                resolve({ success: true, category: selectedCategory });
            } catch (err) {
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        icon: 'error',
                        title: t('swal.title.error'),
                        text: err.message,
                        background: '#1A1A1A',
                        color: '#EFEFEF',
                    });
                }
                reject(err);
            }
        };
    });
}

window.reportContent = reportContent;
window.openCacaoReportModal = openReportModal;
window.closeCacaoReportModal = closeReportModal;

export default reportContent;
