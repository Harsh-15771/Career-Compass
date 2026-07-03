from typing import Dict, List

SKILL_ALIASES: Dict[str, str] = {
    'reactjs':       'react',
    'react.js':      'react',
    'angularjs':     'angular',
    'vuejs':         'vue',
    'vue.js':        'vue',
    'nextjs':        'next.js',
    'nodejs':        'node.js',
    'node':          'node.js',
    'expressjs':     'express',
    'express.js':    'express',
    'springboot':    'spring boot',
    'golang':        'go',
    'ml':            'machine learning',
    'ai':            'artificial intelligence',
    'nlp':           'natural language processing',
    'cv':            'computer vision',
    'k8s':           'kubernetes',
    'sklearn':       'scikit-learn',
    'postgres':      'postgresql',
    'dotnet':        '.net',
    'tailwindcss':   'tailwind',
    'amazon web services': 'aws',
    'google cloud':  'gcp',
    'pyspark':       'spark',
    'huggingface':   'hugging face',
}


def normalize_skill(skill: str) -> str:
    cleaned = skill.strip().lower()
    return SKILL_ALIASES.get(cleaned, cleaned)


def fuzzy_match_keywords(
    resume_keywords: List[str],
    jd_keywords: List[str],
    threshold: int = 80,
) -> Dict[str, List[str]]:
    resume_normalized = {normalize_skill(kw): kw for kw in resume_keywords}
    jd_normalized     = {normalize_skill(kw): kw for kw in jd_keywords}

    matched_jd_originals = []
    missing_jd_originals = []
    
    # Try loading rapidfuzz, fallback if unavailable
    has_fuzz = False
    try:
        from rapidfuzz import fuzz
        has_fuzz = True
    except Exception:
        pass

    for jd_canon, jd_original in jd_normalized.items():
        # 1. Exact canonical match
        if jd_canon in resume_normalized:
            matched_jd_originals.append(jd_original)
            continue

        # 2. Fuzzy match against all resume canonical names
        if has_fuzz:
            best_score = 0
            for resume_canon in resume_normalized:
                score = fuzz.token_sort_ratio(jd_canon, resume_canon)
                best_score = max(best_score, score)

            if best_score >= threshold:
                matched_jd_originals.append(jd_original)
            else:
                missing_jd_originals.append(jd_original)
        else:
            # Simple substring fallback if rapidfuzz fails to load
            found = False
            for resume_canon in resume_normalized:
                if jd_canon in resume_canon or resume_canon in jd_canon:
                    found = True
                    break
            if found:
                matched_jd_originals.append(jd_original)
            else:
                missing_jd_originals.append(jd_original)

    return {
        'matched': sorted(matched_jd_originals),
        'missing': missing_jd_originals,
    }